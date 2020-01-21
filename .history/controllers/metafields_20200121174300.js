exports.getAll = (req, res) => {
    const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2019-07/metafields.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': req.session.token
    };
    request.get(shopRequestUrl, { headers: shopRequestHeaders })
    .then((shopResponse) => {
      res.status(200).end(shopResponse);
    })
    .catch((error) => {
      res.status(error.statusCode).send(error.error.error_description);
    });
}

exports.create = (req, res) => {
    var options = {
      method: 'POST',
      uri: 'https://' + req.session.shop + '/admin/api/2020-01/metafields.json',
      headers: {
        'X-Shopify-Access-Token': req.session.token
      },
      body: {
        "metafield": {
          "namespace": "inventory",
          "key": "warehouse",
          "value": 25,
          "value_type": "integer"
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