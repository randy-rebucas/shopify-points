const dotenv = require('dotenv').config();
var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const request = require('request-promise');
// Get Products
router.get('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    const productsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/products.json';
    const productsRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token
    };

    request.get(productsRequestUrl, {
        headers: productsRequestHeaders
    })
    .then((productsResponse) => {
        const productList = JSON.parse(productsResponse).products;
        res.render('products/list', {title: 'Products', products: productList})
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

router.get('/:productId', (req, res) => {
 
    const shopCookie = cookie.parse(req.headers.cookie);
    const variantsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/products/' + req.params.productId + '/variants.json';
    const variantsRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token
    };

    request.get(variantsRequestUrl, {
        headers: variantsRequestHeaders
    })
    .then((variantsResponse) => {
        const varientList = JSON.parse(variantsResponse).variants;
        res.render('products/variants/list', {title: 'Variants', variants: varientList})
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

// Update Metafields
router.post('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    const metaFormVal = {
        pointWidgetTitle: req.body.title,
        pointWidgetToken: req.body.token,
        pointWidgetServer: req.body.server,
        isRounded: req.body.shape
    }
    const newescape = JSON.stringify(metaFormVal);

    const metafieldsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/metafields/' + req.body.metafieldId + '.json';
    const metafieldsRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token,
      "Content-Type": "application/json"
    };

    var metafieldsPayload = {
        "metafield": {
            "namespace": "settings",
            "key": "points",
            "description": "point app styles",
            "value": newescape,
            "value_type": "json_string"
        }
    }

    request.put(metafieldsRequestUrl, {
        headers: metafieldsRequestHeaders,
        json: metafieldsPayload
    })
    .then((metafieldsResponse) => {
        res.redirect('/');
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;