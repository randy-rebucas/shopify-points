const express = require('express');
const router = express.Router();

const controller = require('../controllers/shopify');
/**
 *  Get all customers
 */
router.get('/', controller.install);
/**
 * Get single customer
 */
router.get('/callback', controller.callback);

module.exports = router;