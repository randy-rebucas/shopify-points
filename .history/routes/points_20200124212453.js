const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');

/* GET users listing. */
router.get('/', (req, res) => {
  const shopCookie = cookie.parse(req.headers.cookie);
//   Retrieve a list of all script tags
  const scriptTagRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/script_tags.json';
  const scriptTagRequestHeaders = {
    'X-Shopify-Access-Token': shopCookie.token
  };

  request.get(scriptTagRequestUrl, {
      headers: scriptTagRequestHeaders
  })
  .then((scripTagResponse) => {
    const scriptTagObj = JSON.parse(scripTagResponse,null,2).script_tags;
    // id: 115672252553,
    // src: 'https://djavaskripped.org/fancy.js',
    // event: 'onload',
    // created_at: '2020-01-24T19:58:21+08:00',
    // updated_at: '2020-01-24T19:58:21+08:00',
    // display_scope: 'all'
    res.render('scripts', { title: 'Script tags', scriptTags: scriptTagObj});
    // res.status(200).end(JSON.stringify(JSON.parse(scripTagResponse),null,2));
    //   res.status(200).json({
    //       message: {
    //           ...scripTagResponse
    //       }
    //   });
  })
  .catch((error) => {
      res.status(error.statusCode).send(error.error.error_description);
  });
});

router.delete('/:scriptId', function (req, res) {
    console.log(req.params.scriptId);
    // res.send(req.params.scriptId)
    const shopCookie = cookie.parse(req.headers.cookie);
    //   Retrieve a list of all script tags
    const scriptTagRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/script_tags/' + req.params.scriptId + '.json';
    const scriptTagRequestHeaders = {
        'X-Shopify-Access-Token': shopCookie.token
    };

    request.get(scriptTagRequestUrl, {
        headers: scriptTagRequestHeaders
    })
    .then((scripTagResponse) => {
        res.redirect('/points')
        console.log(scripTagResponse);
        // res.status(200).end(JSON.stringify(JSON.parse(scripTagResponse),null,2));
        //   res.status(200).json({
        //       message: {
        //           ...scripTagResponse
        //       }
        //   });
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

router.post('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
  
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
        console.log(scripTagResponse);
      // res.status(200).end(JSON.stringify(JSON.parse(scripTagResponse),null,2));
      //   res.status(200).json({
      //       message: {
      //           ...scripTagResponse
      //       }
      //   });
    })
    .catch((error) => {
        console.log(error);
      res.status(400).send(error);
      //   res.status(error.statusCode).send(error.error.error_description);
    });
  });

module.exports = router;
