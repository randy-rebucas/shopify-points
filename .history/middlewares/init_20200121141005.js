const Shopify = require('shopify-api-node');
const dotenv = require('dotenv').config();

module.exports = (req, res, next) => {
    try {

        req.shopify = new Shopify({
            shopName: req.session.shop,
            accessToken: req.session.token
        });
        
        // shopify instance
        // req.shopify = new Shopify({
        //     shopName: process.env.SHOPIFY_SHOP, // req.query.shop,
        //     apiKey: process.env.SHOPIFY_API_KEY,
        //     password: process.env.SHOPIFY_API_SECRET
        // });
        // shopify code
        // req.code = req.query.code;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error });
    }
}