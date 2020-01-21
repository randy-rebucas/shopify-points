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
  const sessionToken = req.session.token;
  res.render('index', { title: 'Express', token: sessionToken });
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

    const sessionToken = req.session.token;

    if (sessionToken) {
      res.redirect('/?shop=' + shop);
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
      req.session.token = accessToken;
      req.session.shop = shop;
      res.redirect('/');
      // const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
      // const shopRequestHeaders = {
      //   'X-Shopify-Access-Token': accessToken,
      // };

      // request.get(shopRequestUrl, { headers: shopRequestHeaders })
      // .then((shopResponse) => {
      //   res.status(200).end(shopResponse);
      // })
      // .catch((error) => {
      //   res.status(error.statusCode).send(error.error.error_description);
      // });
    })
    .catch((error) => {
      console.log(error)
      // res.status(error.statusCode).send(error.error.error_description);
    });

  } else {
    res.status(400).send('Required parameters missing');
  }
});
// // initUtils, 
// router.get('/access', (req, res) => {
//   // req.shopify.order
//   // .list({ limit: 5 })
//   // .then((orders) => console.log(orders))
//   // .catch((err) => console.error(err));

//   // req.shopify.metafield
//   // .list({
//   //   metafield: { owner_resource: 'product', owner_id: 632910392 }
//   // })
//   // .then((metafields) => console.log(metafields), (err) => console.error(err));

//     // DONE: Exchange temporary code for a permanent access token
//     const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
//     const accessTokenPayload = {
//       client_id: apiKey,
//       client_secret: apiSecret,
//       code,
//     };

//     request.post(accessTokenRequestUrl, { json: accessTokenPayload })
//     .then((accessTokenResponse) => {
//       const accessToken = accessTokenResponse.access_token;
//       // DONE: Use access token to make API call to 'shop' endpoint
      
      
//       // const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
//       // const shopRequestHeaders = {
//       //   'X-Shopify-Access-Token': accessToken,
//       // };

//       // request.get(shopRequestUrl, { headers: shopRequestHeaders })
//       // .then((shopResponse) => {
//       //   res.status(200).end(shopResponse);
//       // })
//       // .catch((error) => {
//       //   res.status(error.statusCode).send(error.error.error_description);
//       // });
//     })
//     .catch((error) => {
//       res.status(error.statusCode).send(error.error.error_description);
//     });
// });

// exports.getAssets = (req, res, next) => {
//   // req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=config/filestack_data.json', (err, configData, headers) => {
//   //     var configKey = null;
//   //     if(Object.keys(configData).length) {
//   //         var config = JSON.parse(configData.asset.value);
//   //         var configKey = config.key;
//   //     }
//   //     req.shopifyToken.get('/admin/themes/'+req.themeId+'/assets.json?asset[key]=snippets/products.filestack_source_fields.liquid', (err, snipetData, headers) => {
//   //         var snippetKey = false;
//   //         if(Object.keys(snipetData).length) {
//   //             var snippetKey = true;
//   //         }
//   //         req.shopifyToken.get('/admin/api/2019-07/themes/'+req.themeId+'/assets.json', (err, assetData, headers) => {
//   //             console.log(req.shopifyToken.config.shop);
//   //             res.render('index', {
//   //                 title: 'Filestack Shopify API',
//   //                 filastackApi: configKey,
//   //                 snippetFile: snippetKey,
//   //                 assetList: assetData,
//   //                 configSettings: req.configSettingsData,
//   //                 configSchema: req.configSettingsSchema,
//   //                 storeName: req.shopifyToken.config.shop
//   //             });
//   //         });
//   //     });
//   // });
// }

// exports.createMetafield = (req, res, next) => {

//   var metafileds_data = {
//       "metafield": {
//           "namespace": "fs_api",
//           "key": "filestackAPI",
//           "value": val.filestackAPI,
//           "value_type": "string"
//       }
//   }
//   req.shopifyToken.post('/admin/api/2019-04/metafields.json', metafileds_data, (err, data, headers) => {
//       res.redirect('/');
//   });
// }

// router.createSnippetAssets = (req, res, next) => {
//   var assetSnippet = {
//       "asset": {
//           "key": "snippets/products.filestack_source_fields.liquid",
//           "value": `<div style="padding: 0 0 1em 0;">
//                   {% assign filestack = product.metafields.filestack %}
//                   {% assign key = 'filestackId' %}
//                   <a href="{{ filestack[key] }}" target="_blank">View source image</a></div>`
//       }
//   }
//   req.shopifyToken.put('/admin/api/2019-07/themes/'+req.themeId+'/assets.json', assetSnippet, (err, snippetData, headers) => {
//       res.redirect('/');
//   });
// }

// router.createConfigAssets = (req, res, next) => {
//   var assetConfig = {
//       "asset": {
//           "key": "config/filestack_data.json",
//           "value": `{
//               "key": "${req.body.fs_API}"
//           }`
//       }
//   }
//   req.shopifyToken.put('/admin/api/2019-07/themes/'+req.themeId+'/assets.json', assetConfig, function(err, configData, headers) {
//       res.redirect('/');
//   });
// }

module.exports = router;
