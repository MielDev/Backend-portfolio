const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { testimonialPublicLimiter } = require('../middleware/rateLimit');
const { sanitizeFields } = require('../middleware/sanitize');

const testimonialValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('role').optional().isLength({ max: 120 }),
  body('company').optional().isLength({ max: 120 }),
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 2000 }),
  validate,
];

const testimonialSanitize = sanitizeFields({
  strict: ['name', 'role', 'company', 'content'],
});

router.get('/', testimonialController.getPublicTestimonials);
router.get('/verify-token/:token', testimonialController.verifyToken);
router.post(
  '/upload-photo/:token',
  testimonialPublicLimiter,
  testimonialController.requireValidToken,
  upload.single('photo'),
  testimonialController.uploadPhoto
);
router.post(
  '/with-token/:token',
  testimonialPublicLimiter,
  testimonialSanitize,
  testimonialValidation,
  testimonialController.createWithToken
);

router.get('/all', auth, testimonialController.getAllTestimonials);
router.post('/generate-token', auth, testimonialController.generateToken);
router.post('/upload-photo', auth, upload.single('photo'), testimonialController.uploadPhoto);
router.post('/', auth, testimonialSanitize, testimonialValidation, testimonialController.createTestimonial);
router.put('/:id', auth, testimonialSanitize, testimonialValidation, testimonialController.updateTestimonial);
router.delete('/:id', auth, testimonialController.deleteTestimonial);

module.exports = router;
