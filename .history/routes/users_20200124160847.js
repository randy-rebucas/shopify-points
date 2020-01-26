var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');

/* GET users listing. */
router.get('/', (req, res) => {
  const shopCookie = cookie.parse(req.headers.cookie);
  // res.send('respond with a resource');
  const shopRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/shop.json';
  const shopRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token,
  };

  request.get(shopRequestUrl, { headers: shopRequestHeaders })
      .then((shopResponse) => {
          res.status(200).end(JSON.stringify(JSON.parse(shopResponse),null,2));
      })
      .catch((error) => {
          res.status(error.statusCode).send(error.error.error_description);
      });
});

module.exports = router;
