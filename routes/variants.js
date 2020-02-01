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
        console.log(productList);
        res.render('products/list', {title: 'Products', products: productList})
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

router.get('/:variantId', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    const variantsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/variants/' + req.params.variantId + '.json';
    const variantsRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token
    };

    request.get(variantsRequestUrl, {
        headers: variantsRequestHeaders
    })
    .then((variantsResponse) => {
        const varientObj = JSON.parse(variantsResponse).variant;
        console.log(varientObj);
        res.render('products/variants/form', {title: varientObj.title, variant: varientObj})
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

// Update Variants
router.post('/', (req, res) => {
    const shopCookie = cookie.parse(req.headers.cookie);
    const variantsRequestUrl = 'https://' + shopCookie.shopOrigin + '/admin/api/2020-01/variants/' + req.body.id + '.json';
    const variantsRequestHeaders = {
      'X-Shopify-Access-Token': shopCookie.token,
      "Content-Type": "application/json"
    };

    var variantPayload = {
        "variant": {
          "id": req.body.id,
          "title": req.body.title
        }
    }

    request.put(variantsRequestUrl, {
        headers: variantsRequestHeaders,
        json: variantPayload
    })
    .then((variantsResponse) => {
        console.log(variantsResponse);
        // res.redirect('/');
    })
    .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
    });
});

module.exports = router;