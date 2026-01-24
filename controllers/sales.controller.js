const Sales = require('../models/Sales');
const ExcelJS = require('exceljs');
const { sendWhatsappMessage } = require('../services/whatsapp.service');
/**
 * CREATE SALES
 */
exports.createSales = async (req, res) => {
  try {

    // 1️⃣ Create sales record
    const sales = await Sales.create(req.body);

   console.log('Sales Data Received in Controller:', {
  asmname: sales.asmname,
  contactNumber: sales.contactNumber,
  contactPerson: sales.contactPerson
});

    const messageStatus = await sendWhatsappMessage(sales);

    // 3️⃣ Update message status
    sales.whatsappMessageSent = messageStatus;
    await sales.save();

    // 4️⃣ Response
    res.status(201).json({
      success: true,
      data: sales,
      whatsappMessageSent: messageStatus
    });

  } catch (error) {
    console.error('Error creating sales:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create sales registration',
      message: error.message
    });
  }
};

/**
 * GET SALES LIST
 */
exports.getSalesList = async (req, res) => {
  try {
    const list = await Sales.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    console.error('Error fetching sales list:', error);
    res.status(500).json({
      error: 'Failed to fetch sales list',
      message: error.message
    });
  }
};

/**
 * GET SALES BY CASE ID
 */
exports.getSalesByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;
    const sale = await Sales.findOne({ caseId });

    if (!sale) {
      return res.status(404).json({ error: 'Sales record not found' });
    }

    res.json(sale);
  } catch (error) {
    console.error('Error fetching sales by Case ID:', error);
    res.status(500).json({
      error: 'Failed to fetch sales record',
      message: error.message
    });
  }
};

/**
 * ✅ EXPORT SALES TO EXCEL (DATE FILTERED)
 * GET /api/sales/export/excel?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
 */
exports.exportSalesExcel = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const filter = {};
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const sales = await Sales.find(filter)
      .populate('oem', 'name')
      .sort({ createdAt: -1 });


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    // Title
    worksheet.mergeCells('A1:L1');
    worksheet.getCell('A1').value = 'Sales Registration Report';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:L2');
    worksheet.getCell('A2').value =
      `From: ${fromDate || 'All'}  |  To: ${toDate || 'All'}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    worksheet.addRow([]);

    // Header row
    const header = worksheet.addRow([
      'Case ID',
      'Dealer Name',
      'Contact Person',
      'Designation',
      'Contact Number',
      'State',
      'City',
      'OEM',
      'Email',
      'Status',
      'Date',
      'Time'
    ]);

    header.eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Data rows
    sales.forEach(s => {
      worksheet.addRow([
        s.caseId,
        s.dealerName,
        s.contactPerson,
        s.designation,
        s.contactNumber,
        s.state,
        s.city,
        s.oem?.name || '-',  
        s.email,
        s.status,
        new Date(s.createdAt).toLocaleDateString(),
        new Date(s.createdAt).toLocaleTimeString()
      ]);
    });

    worksheet.columns.forEach(col => (col.width = 18));

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Sales_Report.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Excel export failed:', error);
    res.status(500).json({
      error: 'Failed to export sales report',
      message: error.message
    });
  }
};


//Send Thanks Message to Dealers

//endWhatsappThanksMessage(record) {
 // let isWhatMessageSent = false;
  // code that sends whatspp message
  // use axios

  //return isWhatMessageSent;
  
//}
