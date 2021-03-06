const dotenv = require('dotenv').config();
const fs = require('fs');

const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');

// Shopify API configuratios
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
// const scopes = 'read_products, write_products, read_orders, write_orders, read_themes, write_themes, read_script_tags, write_script_tags, write_checkouts';
const scopes = 'read_products';
const forwardingAddress = "https://181c3f84.ngrok.io"; // Replace this with your HTTPS Forwarding address

exports.connect = (req, res) => {
    const shop = req.query.shop;
    if (shop) {
      let dir = 'config/' + shop;

      if (fs.existsSync(dir)){
        return res.status(400).send('Already installed this app!');
      }

      const state = nonce();
      const redirectUri = forwardingAddress + '/shopify/callback';
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
}

exports.callback = (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
  
    if (state !== stateCookie) {
      return res.status(403).send('Request origin cannot be verified');
    }
  
    if (shop && hmac && code) {
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
        // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
        try {
          hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        // timingSafeEqual will return an error if the input buffers are not the same length.
        } catch (e) {
          hashEquals = false;
        };
        
        if (!hashEquals) {
          return res.status(400).send('HMAC validation failed');
        }
        // ===========
        let arr = shop.split('.');
        let shopifyConfig = {
            shopName: shop,
            tempCode: code
        };

        let shopData = JSON.stringify(shopifyConfig);
        let dir = 'config/' + arr[0];

        if (!fs.existsSync(dir)){

            fs.mkdirSync(dir);

            if (fs.existsSync(dir)){
                fs.writeFileSync(dir + '/config.json', shopData);
            }
        }
        res.redirect('/');

        // DONE: Exchange temporary code for a permanent access token

      // TODO
      // Validate request is from Shopify
      // Exchange temporary code for a permanent access token
        // Use access token to make API call to 'shop' endpoint
    } else {
      res.status(400).send('Required parameters missing');
    }
}