const TechnicalLevel = require('../models/TechnicalLevel');

exports.getAll = async (req, res) => {
  try {
    const { type } = req.query;
    const rows = await TechnicalLevel.getAll(type);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const row = await TechnicalLevel.getById(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: row });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const id = await TechnicalLevel.create(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    await TechnicalLevel.update(req.params.id, req.body);
    res.json({ success: true, data: { id: req.params.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await TechnicalLevel.delete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

