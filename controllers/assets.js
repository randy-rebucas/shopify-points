const request = require('request-promise');
// const assetRequestUrl = 'https://' + shop + '/admin/api/2019-07/themes/' + item.id + '/assets.json';
// const assetRequestHeaders = {
//     "Content-Type": "application/json",
//     'X-Shopify-Access-Token': accessToken,
// };
// var assetPayload = {
//     "asset": {
//         "key": "config/sf_config.json",
//         "value": `{
//             "shopName": "${shop}",
//             "accessToken": "${accessToken}"
//         }`
//     }
// }
// request.put(assetRequestUrl, {
//     headers: assetRequestHeaders,
//     json: assetPayload
// })
// .then((assestResponse) => {
// })
// .catch((error) => {
//   res.status(error.statusCode).send(error.error.error_description);
// });
exports.create = (req, res, next) => {
    var options = {
      method: 'PUT',
      uri: 'https://' + req.session.shop + '/admin/api/2020-01/themes/' + req.body.themeId + '/assets.json',
      headers: {
        'X-Shopify-Access-Token': req.session.token
      },
      body: {
        "asset": {
          "key": "snippets/points.liquid",
          "value": "sample"
        }
      },
      json: true // Automatically stringifies the body to JSON
    };
    request(options).then(function (parsedBody) {
      // POST succeeded...
      console.log(parsedBody)
    })
    .catch(function (err) {
      // POST failed...
      console.log(err);
      // res.status(err.statusCode).send(err.error.error_description);
    });
}

exports.getOne = (req, res) => {
  var options = {
    uri: 'https://' + req.session.shop + '/admin/api/2020-01/themes/' + req.params.themeId + '/assets.json?asset[key]=snippets/points.liquid',
    headers: {
      'X-Shopify-Access-Token': req.session.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  request(options)
    .then(function (repos) {
      console.log(repos)
        console.log('User has %d repos', repos.length);
    })
    .catch(function (err) {
        // API call failed...
    });
}