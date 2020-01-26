var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'the tasty point app'});
});

router.get('/callback', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;