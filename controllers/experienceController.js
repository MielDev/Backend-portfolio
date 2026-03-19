const Experience = require('../models/Experience');

exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.getAll();
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createExperience = async (req, res) => {
  try {
    const id = await Experience.create(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    await Experience.update(req.params.id, req.body);
    res.json({ success: true, data: { id: req.params.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    await Experience.delete(req.params.id);
    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
