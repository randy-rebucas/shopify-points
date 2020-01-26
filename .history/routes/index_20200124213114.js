const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();

const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const apiKey = process.env.SHOPIFY_APP_KEY;
const apiSecret = process.env.SHOPIFY_APP_SECRET;
const scopes = 'read_products, write_products, read_orders, write_orders, read_themes, write_themes, read_script_tags, write_script_tags, read_customers, write_customers';
const forwardingAddress = process.env.SHOPIFY_APP_HOST; // Replace this with your HTTPS Forwarding address
/* GET users listing. */
router.get('/', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        // check if already have token
        const tokenCookie = cookie.parse(req.headers.cookie).token;

        const state = nonce();
        const redirectUri = forwardingAddress + '/callback';
        const installUrl = 'https://' + shop +
        '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes +
        '&state=' + state +
        '&redirect_uri=' + redirectUri;

        res.cookie('state', state);

        if (tokenCookie) {
            res.redirect('/users');
        } else {
            res.redirect(installUrl);
        }
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

router.get('/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

    if (shop && hmac && code) {
        // DONE: Validate request is from Shopify
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
                'utf-8'
            );
        let hashEquals = false;

        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        };

        if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }

        // DONE: Exchange temporary code for a permanent access token
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code,
        };

        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                // DONE: Use access token to make API call to 'shop' endpoint
                res.cookie('shopOrigin', shop, { httpOnly: false });
                res.cookie('token', accessToken);
                // check for existing script tags
                const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/script_tags.json?src=' + process.env.SHOPIFY_APP_HOST + '/javascripts/points.js';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken,
                };

                request.get(shopRequestUrl, { headers: shopRequestHeaders })
                    .then((shopResponse) => {
                        // if not script exist
                        if(!shopResponse) {
                            // add the script tags
                            const scriptTagRequestUrl = 'https://' + shop + '/admin/api/2020-01/script_tags.json';
                            const scriptTagRequestHeaders = {
                                'X-Shopify-Access-Token': accessToken,
                                "Content-Type": "application/json"
                            };
                            var scriptTagPayload = {
                                "script_tag": {
                                    "event": "onload",
                                    "src": process.env.SHOPIFY_APP_HOST + "/javascripts/points.js"
                                }
                            }

                            request.post(scriptTagRequestUrl, {
                                    headers: scriptTagRequestHeaders,
                                    json: scriptTagPayload
                                })
                                .then((scripTagResponse) => {
                                    res.redirect('/');
                                })
                                .catch((error) => {
                                    res.status(error.statusCode).send(error.error.error_description);
                                });
                        } else {
                            res.redirect('/');
                        }
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error.error_description);
                    });
                
        })
        .catch((error) => {
            res.status(error.statusCode).send(error.error.error_description);
        });

    } else {
        res.status(400).send('Required parameters missing');
    }
});

module.exports = router;