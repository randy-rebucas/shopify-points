var express = require('express');
var router = express.Router();

// const config = require('../middlewares/index');

const controller = require('../controllers/index');
/* GET home page. */
router.get('/', controller);

module.exports = router;
