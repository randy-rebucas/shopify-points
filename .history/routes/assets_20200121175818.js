const express = require('express');
const router = express.Router();

const controller = require('../controllers/assets');
/**
 *  Post new assets
 */
router.post('/', controller.create);

/** start assets */
router.get('/:themeId', controller.getOne)

module.exports = router;