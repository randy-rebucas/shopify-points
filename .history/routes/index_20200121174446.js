var express = require('express');
var router = express.Router();
/* GET home page. */

router.get('/', (req, res, next) => {
  const sess = {
    token: req.session.token,
    shop: req.session.shop
  }
  res.render('index', { title: 'Express', data: sess });
});

router.get('/customers', (req, res) => {
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
          res.render('customer', { title: 'Customer' });
      })
      .catch(function (err) {
          // API call failed...
      });
});

router.get('/shop', (req, res, next) => {

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
})

router.get('/theme', (req, res, next) => {
  const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/themes.json';
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': req.session.token,
  };

  request.get(shopRequestUrl, { headers: shopRequestHeaders })
  .then((shopResponse) => {
    const themeObj = JSON.parse(shopResponse)

    res.render('theme', { title: 'Theme', themeId: themeObj.themes[0].id })
  })
  .catch((error) => {
    res.status(error.statusCode).send(error.error.error_description);
  });
});

/** start assets */
router.get('/assets/:themeId', (req, res) => {
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
})

router.post('/assets', (req, res, next) => {
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
});

/** end assests */

module.exports = router;
