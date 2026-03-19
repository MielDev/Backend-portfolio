const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const testimonialValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('content').notEmpty().withMessage('Content is required'),
  validate
];

// Public routes
router.get('/', testimonialController.getPublicTestimonials);

// Protected routes
router.get('/all', auth, testimonialController.getAllTestimonials);
router.post('/', auth, testimonialValidation, testimonialController.createTestimonial);
router.put('/:id', auth, testimonialValidation, testimonialController.updateTestimonial);
router.delete('/:id', auth, testimonialController.deleteTestimonial);

module.exports = router;
