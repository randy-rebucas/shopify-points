const request = require('request-promise');

exports.index = (req, res, next) => {
    console.log(req.name);
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
    res.render('index', { title: 'Shopify App - Filestack', data:  '' });
}