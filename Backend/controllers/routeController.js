const Route = require('../models/Route');
const Vehicle = require('../models/Vehicle');
const { findOptimalRoute } = require('../services/routingService');

// Get all routes
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true })
      .populate('vehicles');
    
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get route by ID
const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const route = await Route.findById(id)
      .populate('vehicles');
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new route
const createRoute = async (req, res) => {
  try {
    const {
      name,
      origin,
      destination,
      waypoints,
      fare,
      estimatedDuration
    } = req.body;
    
    if (!name || !origin || !destination || !fare || !estimatedDuration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newRoute = new Route({
      name,
      origin,
      destination,
      waypoints,
      fare,
      estimatedDuration
    });
    
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a route
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedRoute = await Route.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    res.json(updatedRoute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a route
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRoute = await Route.findByIdAndDelete(id);
    
    if (!deletedRoute) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find optimal route between two points
const findRoute = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }
    
    const optimalRoute = await findOptimalRoute(origin, destination);
    
    res.json(optimalRoute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  findRoute
};