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