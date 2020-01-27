const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');

// Get Metafields
router.get('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    const metafieldsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/metafields.json';
    const metafieldsRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token
    };

    request.get(metafieldsRequestUrl, {
        headers: metafieldsRequestHeaders
    })
    .then((metafieldsResponse) => {
        const metaFields = JSON.parse(metafieldsResponse);
        var metafieldsObj =  metaFields.metafields.filter(function(metafield) {
            return metafield.key == 'points';
        })[0];
        const metaFieldVal = JSON.parse(metafieldsObj.value);
        res.render('index', {title: 'Points app', metafieldId: metafieldsObj.id, metavalue: metaFieldVal})
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

// Update Metafields
router.post('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    console.log(req.body)
    const metaFormVal = {
        pointWidgetTitle: req.body.title,
        pointWidgetToken: req.body.token,
        pointWidgetServer: req.body.server,
        isRounded: req.body.shape
    }
    const newescape = JSON.stringify(metaFormVal);

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
            "value": newescape,
            "value_type": "json_string"
        }
    }

    request.put(metafieldsRequestUrl, {
        headers: metafieldsRequestHeaders,
        json: metafieldsPayload
    })
    .then((metafieldsResponse) => {
        console.log(metafieldsResponse)
        res.redirect('/');
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;