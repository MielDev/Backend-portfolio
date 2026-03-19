const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const blogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('read_minutes').isInt({ min: 1 }).withMessage('Read minutes must be a positive integer'),
  validate
];

// Public routes
router.get('/', blogController.getPublishedPosts);

// Protected routes
router.get('/admin/all', auth, blogController.getAllPosts);
router.post('/', auth, blogValidation, blogController.createPost);
router.put('/:id', auth, blogValidation, blogController.updatePost);
router.delete('/:id', auth, blogController.deletePost);

router.get('/:slug', blogController.getPostBySlug);

module.exports = router;
