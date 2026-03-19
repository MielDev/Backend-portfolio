const Skill = require('../models/Skill');

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.getAll();
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.getById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const id = await Skill.create(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    await Skill.update(req.params.id, req.body);
    res.json({ success: true, data: { id: req.params.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    await Skill.delete(req.params.id);
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
