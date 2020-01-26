const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');

/* GET users listing. */
router.get('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    //   Retrieve a list of all script tags
    const metafiledsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/metafields.json';
    const metafiledsRequestHeaders = {
        'X-Shopify-Access-Token': shopCookie.token
    };

    request.get(metafiledsRequestUrl, {
        headers: metafiledsRequestHeaders
    })
    .then((metafiledsResponse) => {
        const metafieldObjs = JSON.parse(metafiledsResponse, null, 2).metafields.filter(function(metafieldObj) {
            return metafieldObj.key == "points";
        })[0];
        const val = JSON.parse(metafieldObjs.value);
        console.log(val);
        res.render('points', { title: 'Metafields', metafieldObj: metafieldObjs, metavalue: val});
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

router.delete('/:scriptId', function (req, res) {
    // console.log(req.params.scriptId);
    // // res.send(req.params.scriptId)
    // const shopCookie = cookie.parse(req.headers.cookie);
    // //   Retrieve a list of all script tags
    // const scriptTagRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/script_tags/' + req.params.scriptId + '.json';
    // const scriptTagRequestHeaders = {
    //     'X-Shopify-Access-Token': shopCookie.token
    // };

    // request.get(scriptTagRequestUrl, {
    //     headers: scriptTagRequestHeaders
    // })
    // .then((scripTagResponse) => {
    //     res.redirect('/points')
    //     console.log(scripTagResponse);
    //     // res.status(200).end(JSON.stringify(JSON.parse(scripTagResponse),null,2));
    //     //   res.status(200).json({
    //     //       message: {
    //     //           ...scripTagResponse
    //     //       }
    //     //   });
    // })
    // .catch((error) => {
    //     res.status(error.statusCode).send(error.error.error_description);
    // });
});

router.post('/update', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);

    const metaFormVal = {
        "pointWidgetTitle": req.body.title,
        "isRounded": true
    }

    const metaValue = JSON.stringify(JSON.stringify(metaFormVal));
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
            "value": metaValue,
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
        console.log(errObj);
        res.status(error.statusCode).send(error.error.error_description);
    });
});

router.post('/', (req, res) => {
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
            "value": "{\"pointWidgetTitle\": \"Your Tasty Point\",\"isRounded\": true }",
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
        res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;
