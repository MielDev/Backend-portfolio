const Analytics = require('../models/Analytics');

exports.track = async (req, res) => {
  try {
    await Analytics.track(req.body);
    res.json({ success: true, message: 'Tracked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOverview = async (req, res) => {
  try {
    const overview = await Analytics.getOverview();
    res.json({ success: true, data: overview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDailyStats = async (req, res) => {
  try {
    const stats = await Analytics.getDailyStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSources = async (req, res) => {
  try {
    const sources = await Analytics.getSources();
    res.json({ success: true, data: sources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCountries = async (req, res) => {
  try {
    const countries = await Analytics.getCountries();
    res.json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
