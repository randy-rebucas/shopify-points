const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
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

        let shopRawConfig = fs.readFileSync('config/' + store + '/config.json');
        let shopConfig = JSON.parse(shopRawConfig);
        req.shopName = shopConfig.shopName;
        req.accessToken = shopConfig.accessToken;

        next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error });
    }
}