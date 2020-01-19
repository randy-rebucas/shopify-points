const express = require('express');
const router = express.Router();

const controller = require('../controllers/shopify');

router.get('/', controller.connect);

router.get('/callback', controller.callback);

module.exports = router;