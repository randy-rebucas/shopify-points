const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');

/* GET resource. */
router.get('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
  // check for existing script tags
  const shopRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/script_tags.json?src=' + process.env.SHOPIFY_APP_HOST + '/javascripts/points.js';
  const shopRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token,
  };

  request.get(shopRequestUrl, { headers: shopRequestHeaders })
    .then((shopResponse) => {
      const scriptObj = JSON.parse(shopResponse);

      if (Array.isArray(scriptObj.script_tags) && scriptObj.script_tags.length) {
        // console.log('not empty');
        res.redirect('/');
      } else {
            // add the script tags
            const scriptTagRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/script_tags.json';
            const scriptTagRequestHeaders = {
                'X-Shopify-Access-Token': shopCookie.token,
                "Content-Type": "application/json"
            };
            var scriptTagPayload = {
                "script_tag": {
                    "event": "onload",
                    "src": process.env.SHOPIFY_APP_HOST + "/javascripts/points.js"
                }
            }

            request.post(scriptTagRequestUrl, {
                    headers: scriptTagRequestHeaders,
                    json: scriptTagPayload
                })
                .then((scripTagResponse) => {
                    res.redirect('/');
                })
                .catch((error) => {
                    res.status(error.statusCode).send(error.error.error_description);
                });
      }
        // if not script exist
        // if(!shopResponse) {
        //     // add the script tags
        //     const scriptTagRequestUrl = 'https://' + shop + '/admin/api/2020-01/script_tags.json';
        //     const scriptTagRequestHeaders = {
        //         'X-Shopify-Access-Token': accessToken,
        //         "Content-Type": "application/json"
        //     };
        //     var scriptTagPayload = {
        //         "script_tag": {
        //             "event": "onload",
        //             "src": process.env.SHOPIFY_APP_HOST + "/javascripts/points.js"
        //         }
        //     }

        //     request.post(scriptTagRequestUrl, {
        //             headers: scriptTagRequestHeaders,
        //             json: scriptTagPayload
        //         })
        //         .then((scripTagResponse) => {
        //             res.redirect('/');
        //         })
        //         .catch((error) => {
        //             res.status(error.statusCode).send(error.error.error_description);
        //         });
        // } else {
        //     res.redirect('/');
        // }
    })
    .catch((error) => {
      console.log(error);
        // res.status(error.statusCode).send(error.error.error_description);
    });
  // const shopRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/shop.json';
  // const shopRequestHeaders = {
  //     'X-Shopify-Access-Token': shopCookie.token,
  // };

  // request.get(shopRequestUrl, { headers: shopRequestHeaders })
  //     .then((shopResponse) => {
  //         res.status(200).end(JSON.stringify(JSON.parse(shopResponse),null,2));
  //     })
  //     .catch((error) => {
  //         res.status(error.statusCode).send(error.error.error_description);
  //     });
});

module.exports = router;