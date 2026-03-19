const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const availabilityValidation = [
  body('badge_text').notEmpty().withMessage('Badge text is required'),
  body('headline').notEmpty().withMessage('Headline is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('tags').isArray().withMessage('Tags must be an array'),
  body('primary_cta_text').notEmpty().withMessage('Primary CTA text is required'),
  body('primary_cta_type').notEmpty().withMessage('Primary CTA type is required'),
  body('secondary_cta_text').notEmpty().withMessage('Secondary CTA text is required'),
  body('secondary_cta_url').notEmpty().withMessage('Secondary CTA url is required'),
  validate
];

router.get('/', availabilityController.getAvailability);
router.put('/', auth, availabilityValidation, availabilityController.updateAvailability);

module.exports = router;

