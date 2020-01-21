const express = require('express');
const router = express.Router();

const controller = require('../controllers/metafields');
/**
 *  Get all metafields
 */
router.get('/', controller.getAll);
/**
 * Get single metafields
 */
router.post('/', controller.create);

module.exports = router;