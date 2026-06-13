const Analytics = require('../models/Analytics');

exports.track = async (req, res) => {
  try {
    const hasConsent =
      req.body.consent_analytics === true ||
      req.body.consent_analytics === 1 ||
      req.body.consent_analytics === 'true';
    const ip = hasConsent ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : null;
    const user_agent = hasConsent ? req.headers['user-agent'] : null;
    await Analytics.track({ ...req.body, ip, user_agent });
    res.json({ success: true, message: 'Tracked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOverview = async (req, res) => {
  try {
    const { range } = req.query;
    const overview = await Analytics.getOverview(range);
    res.json({ success: true, data: overview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDailyStats = async (req, res) => {
  try {
    const { range } = req.query;
    const stats = await Analytics.getDailyStats(range);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSources = async (req, res) => {
  try {
    const { range } = req.query;
    const sources = await Analytics.getSources(range);
    res.json({ success: true, data: sources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCountries = async (req, res) => {
  try {
    const { range } = req.query;
    const countries = await Analytics.getCountries(range);
    res.json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDevices = async (req, res) => {
  try {
    const { range } = req.query;
    const devices = await Analytics.getDevices(range);
    res.json({ success: true, data: devices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBrowsers = async (req, res) => {
  try {
    const { range } = req.query;
    const browsers = await Analytics.getBrowsers(range);
    res.json({ success: true, data: browsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTopPages = async (req, res) => {
  try {
    const { range } = req.query;
    const pages = await Analytics.getTopPages(range);
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecentEvents = async (req, res) => {
  try {
    const { limit } = req.query;
    const events = await Analytics.getRecentEvents(limit);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRealtime = async (req, res) => {
  try {
    const { minutes } = req.query;
    const realtime = await Analytics.getRealtime(minutes);
    res.json({ success: true, data: realtime });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHourlyStats = async (req, res) => {
  try {
    const { range } = req.query;
    const stats = await Analytics.getHourlyStats(range);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
