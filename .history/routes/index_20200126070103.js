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

    // var metafieldsPayload = {
    //     "metafield": {
    //         "namespace": "settings",
    //         "key": "points",
    //         "description": "point app styles",
    //         "value": {
    //             "pointWidgetTitle": "Your Tasty Point",
    //             "isRounded": true
    //         },
    //         "value_type": "json_string"
    //     }
    // }
  
    // request.post(metafieldsRequestUrl, {
    //     headers: metafieldsRequestHeaders,
    //     json: metafieldsPayload
    // })
    // .then((metafieldsResponse) => {
    //     const metafieldObj = metafieldsResponse.metafield;
    //     const metaFieldVal = JSON.parse(metafieldObj.value);
    //     res.render('index', {title: 'Points app', metafield: metafieldObj, metavalue: metaFieldVal})
    // })
    // .catch((error) => {
    //     res.status(error.statusCode).send(error.error.error_description);
    // });
});

router.get('/getmetafields', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    res.status(200).json({
        shop: shopCookie.shopOrigin
    });
    // const metafieldsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/metafields.json';
    // const metafieldsRequestHeaders = {
    //   'X-Shopify-Access-Token': shopCookie.token
    // };

    // request.get(metafieldsRequestUrl, {
    //     headers: metafieldsRequestHeaders
    // })
    // .then((metafieldsResponse) => {
    //     const metaFields = JSON.parse(metafieldsResponse);
    //     var metafieldsObj =  metaFields.metafields.filter(function(metafield) {
    //         return metafield.key == 'points';
    //     })[0];
    //     res.status(200).json(metafieldsObj);
    // })
    // .catch((error) => {
    //     console.log(error);
    //     // res.status(error.statusCode).send(error.error.error_description);
    // });
})

router.post('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);

    const metaFormVal = {
        pointWidgetTitle: req.body.title,
        isRounded: true
    }
    const newescape = JSON.stringify(metaFormVal);
    console.log(newescape);
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
        res.redirect('/');
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;