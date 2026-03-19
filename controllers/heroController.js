const Hero = require('../models/Hero');

exports.getHero = async (req, res) => {
  try {
    const hero = await Hero.get();
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    await Hero.update(req.body);
    res.json({ success: true, message: 'Hero section updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
