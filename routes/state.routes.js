const express = require('express');
const router = express.Router();
const controller = require('../controllers/state.controller');

router.post('/', controller.createState);
router.get('/', controller.getAllStates);

module.exports = router;

