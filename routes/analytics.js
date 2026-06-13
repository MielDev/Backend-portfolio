const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const { analyticsLimiter } = require('../middleware/rateLimit');

// Public route (auto-called from portfolio) — rate-limited per IP.
router.post('/track', analyticsLimiter, analyticsController.track);

// Protected routes
router.get('/overview', auth, analyticsController.getOverview);
router.get('/daily', auth, analyticsController.getDailyStats);
router.get('/sources', auth, analyticsController.getSources);
router.get('/countries', auth, analyticsController.getCountries);
router.get('/devices', auth, analyticsController.getDevices);
router.get('/browsers', auth, analyticsController.getBrowsers);
router.get('/top-pages', auth, analyticsController.getTopPages);
router.get('/realtime', auth, analyticsController.getRealtime);
router.get('/hourly', auth, analyticsController.getHourlyStats);
router.get('/recent-events', auth, analyticsController.getRecentEvents);

module.exports = router;
