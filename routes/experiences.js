const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const experienceValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('start_date').notEmpty().isDate().withMessage('Valid start date is required'),
  body('digital_folder_url').optional({ nullable: true, checkFalsy: true }).isLength({ max: 500 }).withMessage('Digital folder URL is too long'),
  validate
];

// Public routes
router.get('/', experienceController.getAllExperiences);

// Protected routes
router.post('/', auth, experienceValidation, experienceController.createExperience);
router.put('/:id', auth, experienceValidation, experienceController.updateExperience);
router.delete('/:id', auth, experienceController.deleteExperience);

module.exports = router;
