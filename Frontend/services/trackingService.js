import apiClient from '../api/client';

const getVehiclesOnRoute = async (routeId) => {
  // This is a placeholder. In a real app, you would have an endpoint for this.
  // For now, we'll simulate it by getting route details.
  try {
    const response = await apiClient.get(`/routes/${routeId}`);
    return response.data.vehicles || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch vehicles');
  }
};

const getNearbyVehicles = async (lat, lon, maxDistance = 1000) => {
  // This is a placeholder. In a real app, you would have an endpoint for this.
  // For now, we'll simulate it by getting all routes and their vehicles.
  try {
    const response = await apiClient.get('/routes');
    const allVehicles = response.data.flatMap(route => route.vehicles || []);
    
    // In a real app, you would filter by distance on the backend
    // For now, we'll just return all vehicles
    return allVehicles;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch nearby vehicles');
  }
};

export default {
  getVehiclesOnRoute,
  getNearbyVehicles,
};