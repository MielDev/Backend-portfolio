const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const skillValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('technologies').isArray().withMessage('Technologies must be an array'),
  validate
];

// Public routes
router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);

// Protected routes
router.post('/', auth, skillValidation, skillController.createSkill);
router.put('/:id', auth, skillValidation, skillController.updateSkill);
router.delete('/:id', auth, skillController.deleteSkill);

module.exports = router;
