const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');
const Route = require('../models/Route');

// Update driver location and broadcast to passengers
const updateDriverLocation = async (driverId, routeId, location) => {
  try {
    // In a real implementation, this would use Socket.io to broadcast to passengers
    // For now, we'll just update the driver's location in the database
    
    await Driver.findByIdAndUpdate(
      driverId,
      { currentLocation: location }
    );
    
    // Broadcast to passengers (in a real implementation)
    // io.to(routeId).emit('location-update', {
    //   driverId,
    //   location
    // });
    
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Get vehicles on a specific route with their locations
const getVehiclesOnRoute = async (routeId) => {
  try {
    const vehicles = await Vehicle.find({ route: routeId, isActive: true })
      .populate({
        path: 'driver',
        select: 'name currentLocation rating'
      });
    
    return vehicles;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get nearby vehicles based on user location
const getNearbyVehicles = async (latitude, longitude, maxDistance = 1000) => {
  try {
    // Find vehicles within maxDistance meters of the user's location
    const vehicles = await Vehicle.find({
      isActive: true
    }).populate({
      path: 'driver',
      match: { isActive: true },
      select: 'name currentLocation rating'
    }).populate('route');
    
    // Filter vehicles based on distance (in a real app, this would use MongoDB's geospatial queries)
    const nearbyVehicles = vehicles.filter(vehicle => {
      if (!vehicle.driver || !vehicle.driver.currentLocation) return false;
      
      const distance = calculateDistance(
        latitude, 
        longitude, 
        vehicle.driver.currentLocation.latitude, 
        vehicle.driver.currentLocation.longitude
      );
      
      return distance <= maxDistance;
    });
    
    return nearbyVehicles;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Calculate distance between two points in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

module.exports = {
  updateDriverLocation,
  getVehiclesOnRoute,
  getNearbyVehicles,
  calculateDistance
};