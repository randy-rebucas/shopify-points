const express = require('express');
const router = express.Router();

const controller = require('../controllers/customers');
/**
 *  Get all customers
 */
router.get('/', controller.getAll);
/**
 * Get single customer
 */
router.get('/:customerId', controller.getOne);

module.exports = router;