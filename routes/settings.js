const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middleware/auth');
const settingsAssetUpload = require('../middleware/settingsAssetUpload');

// Public route, used by the portfolio home page for branding, colors and SEO.
router.get('/', settingController.getAllSettings);

// Protected routes
router.post('/assets', auth, settingsAssetUpload.single('file'), settingController.uploadAsset);
router.put('/:key', auth, settingController.updateSetting);

module.exports = router;
