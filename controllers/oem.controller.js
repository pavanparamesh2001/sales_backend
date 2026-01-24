const OEM = require('../models/OEM');

exports.createOEM = async (req, res) => {
  try {
    const oem = await OEM.create(req.body);
    res.status(201).json({ success: true, data: oem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllOEMs = async (req, res) => {
  try {
    const oems = await OEM.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: oems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

