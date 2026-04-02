const Testimonial = require('../models/Testimonial');
const TestimonialToken = require('../models/TestimonialToken');

exports.getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.getPublic();
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // On renvoie le chemin relatif de l'image stockée
    const photoPath = `uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      data: { photo: photoPath } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.getAll();
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    const id = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    await Testimonial.update(req.params.id, req.body);
    res.json({ success: true, data: { id: req.params.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.delete(req.params.id);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateToken = async (req, res) => {
  try {
    const token = await TestimonialToken.create();
    res.json({ success: true, data: { token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const valid = await TestimonialToken.verify(req.params.token);
    res.json({ success: true, data: { valid } });
  } catch (error) {
    res.json({ success: true, data: { valid: false } });
  }
};

exports.createWithToken = async (req, res) => {
  try {
    const isValid = await TestimonialToken.verify(req.params.token);
    if (!isValid) return res.status(403).json({ success: false, message: "Lien invalide ou expiré" });
    
    const id = await Testimonial.create(req.body);
    await TestimonialToken.use(req.params.token); // Invalide le lien après usage
    
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
