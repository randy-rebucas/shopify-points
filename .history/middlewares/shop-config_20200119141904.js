const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        // const accessTokenPayload = {
        //   client_id: apiKey,
        //   client_secret: apiSecret,
        //   code,
        // };

        // request.post(accessTokenRequestUrl, { json: accessTokenPayload })
        // .then((accessTokenResponse) => {
        //     const accessToken = accessTokenResponse.access_token;
        //     // TODO
        //     // Use access token to make API call to 'shop' endpoint
        //     const shopRequestUrl = 'https://' + shop + '/admin/api/2020-01/shop.json';
        //     const shopRequestHeaders = {
        //         'X-Shopify-Access-Token': accessToken,
        //     };

        //     request.get(shopRequestUrl, { headers: shopRequestHeaders })
        //     .then((shopResponse) => {
        //         res.status(200).end(shopResponse);
        //     })
        //     .catch((error) => {
        //         res.status(error.statusCode).send(error.error.error_description);
        //     });
        // })
        // .catch((error) => {
        //     res.status(error.statusCode).send(error.error.error_description);
        // });

        // middleware function to check for logged-in users
        // if (req.session.client && req.cookies.client_sid) {
        //     res.redirect('/product/create');
        // } else {
        //     next();
        // }
        // console.log(localStorage.getItem('token'));
        //const token = req.headers.authorization.split(' ')[1];
        // const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        // req.configData = {
        //     storeName: decodedToken.store,
        //     storeDomain: decodedToken.storeDomain,
        //     accessToken: decodedToken.accessToken
        // }

        let store = req.params.store;

        if(req.headers.referer) {
            let referer = req.headers.referer;
            let refererArr = referer.split('/')[2];
            store = refererArr.split('.')[0];
        }

        // let shopRawConfig = fs.readFileSync('config/' + store + '/config.json');
        // let shopConfig = JSON.parse(shopRawConfig);
        // req.shopName = shopConfig.shopName;
        // req.accessToken = shopConfig.accessToken;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error });
    }
}