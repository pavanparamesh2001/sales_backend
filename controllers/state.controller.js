const State = require('../models/State');

exports.createState = async (req, res) => {
  try {
    const state = await State.create(req.body);
    res.status(201).json({ success: true, data: state });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
