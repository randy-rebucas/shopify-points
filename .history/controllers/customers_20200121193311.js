const request = require('request-promise');

exports.index = (req, res) => {
    const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/customers.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': req.session.token,
    };
  
    request.get(shopRequestUrl, { headers: shopRequestHeaders })
    .then((shopResponse) => {
    //   res.status(200).end(shopResponse);
      const themeObj = JSON.parse(shopResponse)
        console.log(themeObj);
      res.render('customer', { title: 'Customer' })
    })
    .catch((error) => {
      res.status(error.statusCode).send(error.error.error_description);
    });

    // const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/themes.json';
    // const shopRequestHeaders = {
    //   'X-Shopify-Access-Token': req.session.token,
    // };
  
    // request.get(shopRequestUrl, { headers: shopRequestHeaders })
    // .then((shopResponse) => {
    //   const themeObj = JSON.parse(shopResponse)
  
    //   res.render('theme', { title: 'Theme', themeId: themeObj.themes[0].id })
    // })
    // .catch((error) => {
    //   res.status(error.statusCode).send(error.error.error_description);
    // });
    // var options = {
    //     uri: 'https://' + req.session.shop + '/admin/api/2020-01/customers.json',
    //     headers: {
    //       'X-Shopify-Access-Token': req.session.token
    //     },
    //     json: true // Automatically parses the JSON string in the response
    // };
    // request(options)
    //     .then(function (repos) {
    //         console.log(repos)
    //         console.log('User has %d repos', repos.length);
    //         res.render('customers/index', { title: 'Customer' });
    //     })
    //     .catch(function (err) {
    //         // API call failed...
    //     });
}

exports.getOne = (req, res) => {
    var options = {
        uri: 'https://' + req.session.shop + '/admin/api/2020-01/customers.json',
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