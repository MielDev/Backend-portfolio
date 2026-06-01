const Setting = require('../models/Setting');

exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.getAll();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    await Setting.update(key, value);
    res.json({ success: true, message: `Setting ${key} updated` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAsset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const assetPath = `/uploads/branding/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Settings asset uploaded successfully',
      data: {
        url: assetPath,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
