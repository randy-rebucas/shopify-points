var express = require('express');
var router = express.Router();

const  initialized = require('../middlewares/init');

const controller = require('./../controllers/index');
/* GET home page. */
router.get('/', initialized, controller.index);

module.exports = router;
