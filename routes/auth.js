const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// POST /api/auth/login
router.post('/login', loginValidation, authController.login);

// GET /api/auth/me (Protected)
router.get('/me', auth, authController.getMe);

module.exports = router;
