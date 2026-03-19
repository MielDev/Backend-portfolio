const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const projectValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  validate
];

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

// Protected routes
router.post('/', auth, projectValidation, projectController.createProject);
router.put('/:id', auth, projectValidation, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
