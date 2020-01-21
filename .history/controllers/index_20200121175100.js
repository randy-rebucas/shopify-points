exports.index = (req, res, next) => {
    const sess = {
      token: req.session.token,
      shop: req.session.shop
    }
    res.render('index', { title: 'Express', data: sess });
}