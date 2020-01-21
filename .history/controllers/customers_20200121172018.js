const request = require('request-promise');

exports.getAll = (req, res) => {
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
            res.render('customers/customer-list', { title: 'Customer' });
        })
        .catch(function (err) {
            // API call failed...
        });
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