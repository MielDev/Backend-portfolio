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
