const About = require('../models/About');

exports.getAbout = async (req, res) => {
  try {
    const about = await About.get();
    res.json({ success: true, data: about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    await About.update(req.body);
    res.json({ success: true, message: 'About section updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const photoPath = `/uploads/${req.file.filename}`;
    await About.updatePhoto(photoPath);
    
    res.json({ 
      success: true, 
      message: 'Photo uploaded successfully',
      data: { photo: photoPath }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
