const cookie = require('cookie');

module.exports = (req, res, next) => {
    try {
        const shopCookie = cookie.parse(req.headers.cookie);
        console.log(shopCookie);
        req.shop = shopCookie.shopOrigin,
        req.token = shopCookie.token
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error });
    }
}