const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Route = require('../models/Route');
const { updateDriverLocation } = require('../services/trackingService');

// Get driver profile
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user.id)
      .populate('vehicle')
      .populate('currentRoute');
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update driver location
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { currentLocation: { latitude, longitude } },
      { new: true }
    );
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    // Broadcast location update to passengers
    updateDriverLocation(driver._id, driver.currentRoute, { latitude, longitude });
    
    res.json({ message: 'Location updated successfully', location: driver.currentLocation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Start trip
const startTrip = async (req, res) => {
  try {
    const { routeId } = req.body;
    
    if (!routeId) {
      return res.status(400).json({ message: 'Route ID is required' });
    }
    
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { 
        isActive: true,
        currentRoute: routeId
      },
      { new: true }
    ).populate('currentRoute');
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json({ message: 'Trip started successfully', driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// End trip
const endTrip = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { 
        isActive: false,
        currentRoute: null
      },
      { new: true }
    );
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json({ message: 'Trip ended successfully', driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get route details
const getRouteDetails = async (req, res) => {
  try {
    const { routeId } = req.params;
    
    const route = await Route.findById(routeId)
      .populate('vehicles');
    
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDriverProfile,
  updateLocation,
  startTrip,
  endTrip,
  getRouteDetails
};