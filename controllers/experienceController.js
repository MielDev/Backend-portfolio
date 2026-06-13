const Experience = require('../models/Experience');
const { toPublicUploadPath } = require('../middleware/upload');

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_err) {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const normalizePayload = (body, file) => {
  const data = { ...body };
  data.description = parseArrayField(data.description);
  data.end_date = data.end_date || null;
  data.digital_folder_url = data.digital_folder_url || null;

  if (file) {
    data.image = toPublicUploadPath(file);
  } else if (data.remove_image === '1' || data.remove_image === 1 || data.remove_image === true) {
    data.image = null;
  }

  return data;
};

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
    const data = normalizePayload(req.body, req.file);
    const id = await Experience.create(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const data = normalizePayload(req.body, req.file);
    await Experience.update(req.params.id, data);
    res.json({ success: true, data: { id: req.params.id, ...data } });
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
