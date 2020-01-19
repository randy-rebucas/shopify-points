
module.exports = (req, res, next) => {
    try {
        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
          client_id: apiKey,
          client_secret: apiSecret,
          code,
        };

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error });
    }
}