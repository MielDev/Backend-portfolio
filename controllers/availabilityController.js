const Availability = require('../models/Availability');

exports.getAvailability = async (req, res) => {
  try {
    const availability = await Availability.get();
    res.json({ success: true, data: availability });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const id = await Availability.upsert(req.body);
    res.json({ success: true, data: { id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

