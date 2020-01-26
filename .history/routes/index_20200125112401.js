const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');

/* GET resource. */
router.get('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    const metafieldsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/metafields.json';
    const metafieldsRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token,
      "Content-Type": "application/json"
    };
    var metafieldsPayload = {
        "metafield": {
            "namespace": "settings",
            "key": "points",
            "description": "point app styles",
            "value": {
                "pointWidgetTitle": "Your Tasty Point",
                "isRounded": true
            },
            "value_type": "json_string"
        }
    }
  
    request.post(metafieldsRequestUrl, {
        headers: metafieldsRequestHeaders,
        json: metafieldsPayload
    })
    .then((metafieldsResponse) => {
        console.log(metafieldsResponse);
      // res.status(200).end(JSON.stringify(JSON.parse(scripTagResponse),null,2));
      //   res.status(200).json({
      //       message: {
      //           ...scripTagResponse
      //       }
      //   });
    //   res.render('index', {title: 'Points app'})
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;