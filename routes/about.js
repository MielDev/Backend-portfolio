const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sanitizeFields } = require('../middleware/sanitize');

router.get('/', aboutController.getAbout);
router.put(
  '/',
  auth,
  sanitizeFields({
    strict: ['name', 'title', 'email', 'phone', 'location', 'nationality'],
    rich: ['bio'],
  }),
  aboutController.updateAbout
);
router.post('/upload-photo', auth, upload.single('photo'), aboutController.uploadPhoto);

module.exports = router;
