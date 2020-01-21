const express = require('express');
const router = express.Router();

const controller = require('../controllers/assets');
/**
 *  Post new assets
 */
router.post('/', controller.create);

module.exports = router;