const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, jpeg, png, webp) are allowed'));
  }
});

// Public route
router.get('/', aboutController.getAbout);

// Protected routes
router.put('/', auth, aboutController.updateAbout);
router.post('/upload-photo', auth, upload.single('photo'), aboutController.uploadPhoto);

module.exports = router;
