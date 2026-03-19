const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Public route (Auto-called from portfolio)
router.post('/track', analyticsController.track);

// Protected routes
router.get('/overview', auth, analyticsController.getOverview);
router.get('/daily', auth, analyticsController.getDailyStats);
router.get('/sources', auth, analyticsController.getSources);
router.get('/countries', auth, analyticsController.getCountries);

module.exports = router;
