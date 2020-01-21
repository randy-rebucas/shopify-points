const express = require('express');
const router = express.Router();

const controller = require('../controllers/shop');
/**
 *  Post new assets
 */
router.get('/', controller.index);

module.exports = router;