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
router.get('/devices', auth, analyticsController.getDevices);
router.get('/browsers', auth, analyticsController.getBrowsers);
router.get('/top-pages', auth, analyticsController.getTopPages);
router.get('/recent-events', auth, analyticsController.getRecentEvents);

module.exports = router;
