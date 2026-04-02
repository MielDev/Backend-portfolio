const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.getAll();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.getById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;
    if (data.tags && typeof data.tags === 'string') {
      try {
        data.tags = JSON.parse(data.tags);
      } catch (e) {
        console.error("Error parsing tags:", e);
      }
    }
    const id = await Project.create(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;
    if (data.tags && typeof data.tags === 'string') {
      try {
        data.tags = JSON.parse(data.tags);
      } catch (e) {
        console.error("Error parsing tags:", e);
      }
    }
    await Project.update(req.params.id, data);
    res.json({ success: true, data: { id: req.params.id, ...data } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.delete(req.params.id);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.incrementViewCount = async (req, res) => {
  try {
    await Project.incrementViews(req.params.id);
    res.json({ success: true, message: 'View count incremented' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
