const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middleware/auth');

// Protected routes
router.get('/', auth, settingController.getAllSettings);
router.put('/:key', auth, settingController.updateSetting);

module.exports = router;
