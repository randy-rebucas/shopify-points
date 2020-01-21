const express = require('express');
const router = express.Router();

const controller = require('../controllers/settings');
/**
 *  Get all settings
 */
router.get('/', controller.index);

module.exports = router;