const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { sanitizeFields } = require('../middleware/sanitize');

// Validation rules
const blogValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('slug').notEmpty().withMessage('Slug is required').matches(/^[a-z0-9-]+$/i),
  body('content').notEmpty().withMessage('Content is required'),
  body('read_minutes').isInt({ min: 1 }).withMessage('Read minutes must be a positive integer'),
  validate,
];

// Public routes
router.get('/', blogController.getPublishedPosts);

// Protected routes — admin can write HTML in `content` (rich), titles strict.
router.get('/admin/all', auth, blogController.getAllPosts);
router.post(
  '/',
  auth,
  sanitizeFields({ strict: ['title', 'slug'], rich: ['content'] }),
  blogValidation,
  blogController.createPost
);
router.put(
  '/:id',
  auth,
  sanitizeFields({ strict: ['title', 'slug'], rich: ['content'] }),
  blogValidation,
  blogController.updatePost
);
router.delete('/:id', auth, blogController.deletePost);

router.get('/:slug', blogController.getPostBySlug);

module.exports = router;
