const express = require('express');
const router = express.Router();
const controller = require('../controllers/oem.controller');

router.post('/', controller.createOEM);
router.get('/', controller.getAllOEMs);

module.exports = router;

