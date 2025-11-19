const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const driverController = require('../controllers/driverController');

// All driver routes require authentication
router.use(auth);

// Get driver profile
router.get('/profile', driverController.getDriverProfile);

// Update driver location
router.post('/location', driverController.updateLocation);

// Start trip
router.post('/trip/start', driverController.startTrip);

// End trip
router.post('/trip/end', driverController.endTrip);

// Get route details
router.get('/route/:routeId', driverController.getRouteDetails);

module.exports = router;