const request = require('request-promise');

exports.index = (req, res, next) => {
    const shopRequestUrl = 'https://' + req.session.shop + '/admin/api/2020-01/themes.json';
    const shopRequestHeaders = {
      'X-Shopify-Access-Token': req.session.token,
    };
  
    request.get(shopRequestUrl, { headers: shopRequestHeaders })
    .then((shopResponse) => {
      const themeObj = JSON.parse(shopResponse)
  
      res.render('settings/index', { title: 'Settings', themeId: themeObj.themes[0].id })
    })
    .catch((error) => {
      res.status(error.statusCode).send(error.error.error_description);
    });
  }