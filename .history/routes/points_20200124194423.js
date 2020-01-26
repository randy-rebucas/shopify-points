var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');

/* GET users listing. */
router.get('/', (req, res) => {
  const shopCookie = cookie.parse(req.headers.cookie);
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

    const assetRequestUrl = 'https://tastypoints.io/akm/restapi.php';
    const assetRequestHeaders = {
        "Content-Type": "application/json"
    };
    var assetPayload = {
        scrdata_id : 60,
        tpsession_id : '778555f85-7927-4d3a-ba36-e5582a3977838',
        access_token : shopCookie.token
    }

    request.post(assetRequestUrl, {
        headers: assetRequestHeaders,
        json: assetPayload
    })
    .then((assestResponse) => {
        res.status(200).json({
            message: {
                ...assestResponse
            }
        });
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;
