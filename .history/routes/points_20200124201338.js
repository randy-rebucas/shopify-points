const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');

/* GET users listing. */
router.get('/', (req, res) => {
  const shopCookie = cookie.parse(req.headers.cookie);

  const scriptTagRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/script_tags.json';
  const scriptTagRequestHeaders = {
    'X-Shopify-Access-Token': shopCookie.token,
    "Content-Type": "application/json"
  };
  var scriptTagPayload = {
    "script_tag": {
      "event": "onload",
      "src": process.env.SHOPIFY_APP_HOST + "/javascripts/test.js"
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

//   var loadScript = function(url, callback){

//     /* JavaScript that will load the jQuery library on Google's CDN.
//        We recommend this code: http://snipplr.com/view/18756/loadscript/.
//        Once the jQuery library is loaded, the function passed as argument,
//        callback, will be executed. */
  
//   };
  
//   var myAppJavaScript = function($){
//     /* Your app's JavaScript here.
//        $ in this scope references the jQuery object we'll use.
//        Don't use 'jQuery', or 'jQuery191', here. Use the dollar sign
//        that was passed as argument.*/
//     $('body').append('<p>Your app is using jQuery version '+$.fn.jquery+'</p>');
//   };
  
//   if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {
//     loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function(){
//       jQuery191 = jQuery.noConflict(true);
//       myAppJavaScript(jQuery191);
//     });
//   } else {
//     myAppJavaScript(jQuery);
//   }
//   const tokenCookie = cookie.parse(req.headers.cookie).token;
//   const shopRequestUrl = 'https://tastypoints.io/akm/restapi.php';
//   const shopRequestHeaders = {
//       'X-Shopify-Access-Token': shopCookie.token,
//   };

//   request.get(shopRequestUrl, { headers: shopRequestHeaders })
//       .then((shopResponse) => {
//           res.status(200).end(JSON.stringify(JSON.parse(shopResponse),null,2));
//       })
//       .catch((error) => {
//           res.status(error.statusCode).send(error.error.error_description);
//       });

    // const assetRequestUrl = 'https://tastypoints.io/akm/restapi.php';
    // const assetRequestHeaders = {
    //     "Content-Type": "application/json"
    // };
    // var assetPayload = {
    //     scrdata_id : 60,
    //     tpsession_id : '778555f85-7927-4d3a-ba36-e5582a3977838',
    //     access_token : shopCookie.token
    // }

    // request.post(assetRequestUrl, {
    //     headers: assetRequestHeaders,
    //     json: assetPayload
    // })
    // .then((assestResponse) => {
    //     res.status(200).json({
    //         message: {
    //             ...assestResponse
    //         }
    //     });
    // })
    // .catch((error) => {
    //     res.status(error.statusCode).send(error.error.error_description);
    // });
});

module.exports = router;
