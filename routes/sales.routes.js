const express = require('express');
const router = express.Router();
const controller = require('../controllers/sales.controller');

router.post('/', controller.createSales);
router.get('/', controller.getSalesList);
router.get('/export/excel', controller.exportSalesExcel);


module.exports = router;



