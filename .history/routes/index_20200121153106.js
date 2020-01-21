var express = require('express');
var router = express.Router();
const dotenv = require('dotenv').config();

const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const Shopify = require('shopify-api-node');
const initUtils = require('./../middlewares/init');

// Shopify API configuratios
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
// const scopes = 'read_products, write_products, read_orders, write_orders, read_themes, write_themes, read_script_tags, write_script_tags, write_checkouts';
const scopes = 'read_products, write_products, read_orders, write_orders, read_themes, write_themes, read_script_tags, write_script_tags';
const forwardingAddress = "https://c2ba8f6b.ngrok.io"; // Replace this with your HTTPS Forwarding address
/* GET home page. */

router.get('/', (req, res, next) => {
  const sess = {
    token: req.session.token,
    shop: req.session.shop
  }
  res.render('index', { title: 'Express', data: sess });
});

router.get('/shop', (req, res, next) => {

  const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/shop.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': req.session.token,
  };

  request.get(shopRequestUrl, { headers: shopRequestHeaders })
  .then((shopResponse) => {
    res.status(200).end(shopResponse);
  })
  .catch((error) => {
    res.status(error.statusCode).send(error.error.error_description);
  });
})

router.get('/theme', (req, res, next) => {
  const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/themes.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': req.session.token,
  };

  request.get(shopRequestUrl, { headers: shopRequestHeaders })
  .then((shopResponse) => {
    const themeObj = JSON.parse(shopResponse)

    console.log(themeObj.themes[0].id);
    res.render('theme', { title: 'Theme', themeId: themeObj.themes[0].id })
    // res.status(200).end(shopResponse);
  })
  .catch((error) => {
    res.status(error.statusCode).send(error.error.error_description);
  });
});

router.post('/assets', (req, res, next) => {
  const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/themes/' + req.body.themeId + '/assets.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': req.session.token,
    'Content-Type': 'application/json',
    'Response-Body': {
      "asset": {
        "key": "templates/test.liquid",
        "value": "sample"
      }
    }
  };
  request.put(shopRequestUrl, { headers: shopRequestHeaders })
  .then((shopResponse) => {
    res.status(200).end(shopResponse);
  })
  .catch((error) => {
    res.status(error.statusCode).send(error.error.error_description);
  });

});

router.get('/metafields', (req, res) => {
  const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2019-07/metafields.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': req.session.token
  };
  request.get(shopRequestUrl, { headers: shopRequestHeaders })
  .then((shopResponse) => {
    res.status(200).end(shopResponse);
  })
  .catch((error) => {
    res.status(error.statusCode).send(error.error.error_description);
  });
});

router.post('/metafields', (req, res) => {
  const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2019-07/metafields.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': req.session.token,
    'Content-Type': 'application/json',
    'Request-Body': {
      "metafield": {
        "namespace": "inventory",
        "key": "warehouse",
        "value": 25,
        "value_type": "integer"
      }
    }
  };

  // Content-Type
  request.post(shopRequestUrl, { headers: shopRequestHeaders } )
  .then((shopResponse) => {
    res.status(200).end(shopResponse);
  })
  .catch((error) => {
    res.status(error.statusCode).send(error.error.error_description);
  });

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

    // const sessionToken = req.session.token;

    // if (sessionToken) {
    //   res.redirect('/?shop=' + shop);
    // } else {
      res.redirect(installUrl);
    // }
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
      res.redirect('/?shop=' + shop);
      
    })
    .catch((error) => {
      console.log(error)
      // res.status(error.statusCode).send(error.error.error_description);
    });

  } else {
    res.status(400).send('Required parameters missing');
  }
});

module.exports = router;
