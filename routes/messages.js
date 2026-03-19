const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Validation rules
const messageValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('content').notEmpty().withMessage('Content is required'),
  validate
];

// Public route (Contact form)
router.post('/', messageValidation, messageController.sendMessage);

// Protected routes
router.get('/', auth, messageController.getAllMessages);
router.put('/:id', auth, messageController.updateMessageStatus);
router.delete('/:id', auth, messageController.deleteMessage);

module.exports = router;
