
module.exports = (req, res, next) => {
    try {
        // const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        // const accessTokenPayload = {
        //   client_id: apiKey,
        //   client_secret: apiSecret,
        //   code,
        // };
        let store = req.params.store;
        console.log(store)
        if(req.headers.referer) {
            let referer = req.headers.referer;
            let refererArr = referer.split('/')[2];
            store = refererArr.split('.')[0];
        }

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error });
    }
}