const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { loginLimiter } = require('../middleware/rateLimit');
const { sanitizeFields } = require('../middleware/sanitize');

// Validation rules
const loginValidation = [
  body('username').notEmpty().withMessage('Username is required').isString().trim(),
  body('password').notEmpty().withMessage('Password is required').isString(),
  validate,
];

// POST /api/auth/login  (rate-limited + sanitized)
router.post(
  '/login',
  loginLimiter,
  sanitizeFields({ strict: ['username'] }),
  loginValidation,
  authController.login
);

// GET /api/auth/me (Protected)
router.get('/me', auth, authController.getMe);

module.exports = router;
