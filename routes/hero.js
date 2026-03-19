const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const auth = require('../middleware/auth');

// Public route
router.get('/', heroController.getHero);

// Protected route
router.put('/', auth, heroController.updateHero);

module.exports = router;
