const express = require('express');
const router = express.Router();

const controller = require('../controllers/shopify');
/**
 *  Install shopify
 */
router.get('/', controller.install);
/**
 * Callback install
 */
router.get('/callback', controller.callback);

module.exports = router;