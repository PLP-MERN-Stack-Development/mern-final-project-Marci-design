import apiClient from '../api/client';

const getRoutes = async () => {
  try {
    const response = await apiClient.get('/routes');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch routes');
  }
};

const getRouteById = async (id) => {
  try {
    const response = await apiClient.get(`/routes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch route');
  }
};

const findOptimalRoute = async (origin, destination) => {
  try {
    const response = await apiClient.get('/routes/find', {
      params: { origin, destination }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to find route');
  }
};

export default {
  getRoutes,
  getRouteById,
  findOptimalRoute,
};