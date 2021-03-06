var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();

const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

const initUtils = require('./../middlewares/init');

// Shopify API configuratios
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
// const scopes = 'read_products, write_products, read_orders, write_orders, read_themes, write_themes, read_script_tags, write_script_tags, write_checkouts';
const scopes = 'read_products, write_products, read_orders, write_orders, read_themes, write_themes, read_script_tags, write_script_tags';
const forwardingAddress = "https://c2ba8f6b.ngrok.io"; // Replace this with your HTTPS Forwarding address
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/install', (req, res) => {
  const shop = req.query.shop;
  if (shop) {
    const state = nonce();
    const redirectUri = forwardingAddress + '/callback';
    const installUrl = 'https://' + shop +
      '/admin/oauth/authorize?client_id=' + apiKey +
      '&scope=' + scopes +
      '&state=' + state +
      '&redirect_uri=' + redirectUri;

    res.cookie('state', state);
    res.redirect(installUrl);
  } else {
    return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
  }
});

router.get('/callback', initUtils, (req, res) => {
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

    // const shopify = new Shopify({
    //   shopName: 'your-shop-name',
    //   accessToken: 'your-oauth-token'
    // });
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
      const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
      const shopRequestHeaders = {
        'X-Shopify-Access-Token': accessToken,
      };

      request.get(shopRequestUrl, { headers: shopRequestHeaders })
      .then((shopResponse) => {
        // res.status(200).end(shopResponse);
        console.log(shopResponse)
        res.render('index', { data: shopResponse });
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

router.get('/access', initUtils, (req, res) => {
  req.shopify.order
  .list({ limit: 5 })
  .then((orders) => console.log(orders))
  .catch((err) => console.error(err));

  // req.shopify.metafield
  // .list({
  //   metafield: { owner_resource: 'product', owner_id: 632910392 }
  // })
  // .then((metafields) => console.log(metafields), (err) => console.error(err));

    // DONE: Exchange temporary code for a permanent access token
    // const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
    // const accessTokenPayload = {
    //   client_id: apiKey,
    //   client_secret: apiSecret,
    //   code,
    // };

    // request.post(accessTokenRequestUrl, { json: accessTokenPayload })
    // .then((accessTokenResponse) => {
    //   const accessToken = accessTokenResponse.access_token;
    //   // DONE: Use access token to make API call to 'shop' endpoint
    //   const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
    //   const shopRequestHeaders = {
    //     'X-Shopify-Access-Token': accessToken,
    //   };

    //   request.get(shopRequestUrl, { headers: shopRequestHeaders })
    //   .then((shopResponse) => {
    //     res.status(200).end(shopResponse);
    //   })
    //   .catch((error) => {
    //     res.status(error.statusCode).send(error.error.error_description);
    //   });
    // })
    // .catch((error) => {
    //   res.status(error.statusCode).send(error.error.error_description);
    // });
});


router.createConfigAssets = (req, res, next) => {
  req.shopifyToken.delete('/admin/api/2019-07/themes/'+req.themeId+'/assets.json?asset[key]=config/filestack_data.json', (err, configData, headers) => {
      var assetConfig = {
          "asset": {
              "key": "config/filestack_data.json",
              "value": `{
                  "key": "${req.body.fs_API}"
              }`
          }
      }
      // req.shopifyToken.put('/admin/api/2019-07/themes/'+req.themeId+'/assets.json', assetConfig, function(err, data, headers) {
      //     res.redirect('/');
      // });
  });
}

module.exports = router;
