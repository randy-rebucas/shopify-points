const request = require('request-promise');

exports.index = function(req, res, next) {
    // res.send('respond with a resource');
    console.log(req.session)
    // res.render('customer', { title: 'Customer' })
    // const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/shop.json';
    // const shopRequestHeaders = {
    //   'X-Shopify-Access-Token': req.session.token,
    // };
  
    // request.get(shopRequestUrl, { headers: shopRequestHeaders })
    // .then((shopResponse) => {
    //   res.status(200).end(shopResponse);
    // })
    // .catch((error) => {
    //   res.status(error.statusCode).send(error.error.error_description);
    // });
    const requestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/customers.json';
    const requestHeaders = {
      'X-Shopify-Access-Token': req.session.token,
    };
  
    request.get(requestUrl, { headers: requestHeaders })
    .then((response) => {
      // res.status(200).end(response);
      // const resObj = JSON.parse(response)
      //   console.log(resObj);
      res.render('shop', { title: 'Customer' })
    })
    .catch((error) => {
      res.status(error.statusCode).send(error.error.error_description);
    });
  }