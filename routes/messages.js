const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimit');
const { sanitizeFields } = require('../middleware/sanitize');

// Validation rules
const messageValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ max: 120 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('subject').optional().isLength({ max: 200 }),
  body('content').notEmpty().withMessage('Content is required').isLength({ max: 5000 }),
  validate,
];

// Public route (Contact form) — sanitized + rate-limited
router.post(
  '/',
  contactLimiter,
  sanitizeFields({ strict: ['name', 'email', 'subject', 'content'] }),
  messageValidation,
  messageController.sendMessage
);

// Protected routes
router.get('/', auth, messageController.getAllMessages);
router.put('/:id', auth, sanitizeFields({ strict: ['status'] }), messageController.updateMessageStatus);
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;
