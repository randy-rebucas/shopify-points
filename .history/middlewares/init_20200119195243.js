
module.exports = (req, res, next) => {
    try {
        let store = req.params.store;

        if(req.headers.referer) {
            let referer = req.headers.referer;
            let refererArr = referer.split('/')[2];
            store = refererArr.split('.')[0];
        }

        console.log(store);
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