const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
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
router.post('/:id/view', projectController.incrementViewCount);

// Protected routes
router.post('/', auth, upload.single('image'), projectController.createProject);
router.put('/:id', auth, upload.single('image'), projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
