const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// Get all routes
router.get('/', routeController.getAllRoutes);

// Get route by ID
router.get('/:id', routeController.getRouteById);

// Create a new route (protected route)
router.post('/', routeController.createRoute);

// Update a route (protected route)
router.put('/:id', routeController.updateRoute);

// Delete a route (protected route)
router.delete('/:id', routeController.deleteRoute);

// Find optimal route between two points
router.get('/find', routeController.findRoute);

module.exports = router;