const request = require('request-promise');

exports.index = (req, res, next) => {

    const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/shop.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': req.session.token,
    };
  
    request.get(shopRequestUrl, { headers: shopRequestHeaders })
    .then((shopResponse) => {
      res.status(200).end(shopResponse);
    })
    .catch((error) => {
      res.status(error.statusCode).send(error.error.error_description);
    });
}