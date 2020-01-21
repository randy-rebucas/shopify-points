exports.index = function(req, res, next) {
    // res.send('respond with a resource');
    const requestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/customers.json';
    const requestHeaders = {
      'X-Shopify-Access-Token': req.session.token,
    };
  
    request.get(requestUrl, { headers: requestHeaders })
    .then((response) => {
    //   res.status(200).end(response);
      const resObj = JSON.parse(response)
        console.log(resObj);
      res.render('customer', { title: 'Customer' })
    })
    .catch((error) => {
      res.status(error.statusCode).send(error.error.error_description);
    });
  }