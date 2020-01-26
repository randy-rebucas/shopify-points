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
        const metafieldObj = metafieldsResponse.metafield;
        const metaFieldVal = JSON.parse(metafieldObj.value);
        res.render('index', {title: 'Points app', metafield: metafieldObj, metavalue: metaFieldVal})
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

router.post('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);

    const metaFormVal = {
        "pointWidgetTitle": req.body.title,
        "isRounded": true
    }

    const metaValue = JSON.parse(JSON.stringify(metaFormVal));
    console.log(metaValue);

    const metafieldsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/metafields/' + req.body.metafieldId + '.json';
    const metafieldsRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token,
      "Content-Type": "application/json"
    };
    var metafieldsPayload = {
        "metafield": {
            "namespace": "settings",
            "key": "points",
            "description": "point app styles",
            "value": JSON.parse(JSON.stringify(metaFormVal)),
            "value_type": "json_string"
        }
    }
  
    request.post(metafieldsRequestUrl, {
        headers: metafieldsRequestHeaders,
        json: metafieldsPayload
    })
    .then((metafieldsResponse) => {
        res.redirect('/points')
    })
    .catch((error) => {
        console.log(error);
        res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;