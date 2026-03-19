const Testimonial = require('../models/Testimonial');

exports.getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.getPublic();
    res.json({ success: true, data: testimonials });
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
