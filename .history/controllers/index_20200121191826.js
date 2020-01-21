const request = require('request-promise');

exports.index = (req, res, next) => {
  // if not jwt sign redirect login
    // bypass

    // const shopRequestUrl = 'https://' + req.shopName + '/admin/api/2019-07/shop.json';
    // const shopRequestHeaders = {
    //     'X-Shopify-Access-Token': req.accessToken,
    // };

    // request.get(shopRequestUrl, { headers: shopRequestHeaders })
    //     .then((shopResponse) => {
    //         var store = JSON.parse(shopResponse);

    //         res.render('index', { title: 'Shopify App - Filestack', data:  store.shop });
    //     })
    //     .catch((error) => {
    //         res.status(error.statusCode).send(error.error.error_description);
    //     });
    const sess = {
      token: req.session.token,
      shop: req.session.shop
    }
    res.render('index', { title: 'Express', data: sess });
}