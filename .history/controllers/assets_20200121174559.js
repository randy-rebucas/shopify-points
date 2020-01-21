const request = require('request-promise');

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