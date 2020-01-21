var express = require('express');
var router = express.Router();
/* GET home page. */
const controller = require('../controllers/index');

router.get('/', controller.index);

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

module.exports = router;
