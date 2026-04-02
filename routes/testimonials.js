const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuration de stockage pour les photos de témoignages
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `testimonial-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

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
router.get('/verify-token/:token', testimonialController.verifyToken);
router.post('/with-token/:token', testimonialController.createWithToken);

// Protected routes
router.get('/all', auth, testimonialController.getAllTestimonials);
router.post('/generate-token', auth, testimonialController.generateToken);
router.post('/upload-photo', upload.single('photo'), testimonialController.uploadPhoto);
router.post('/', auth, testimonialValidation, testimonialController.createTestimonial);
router.put('/:id', auth, testimonialValidation, testimonialController.updateTestimonial);
router.delete('/:id', auth, testimonialController.deleteTestimonial);

module.exports = router;
