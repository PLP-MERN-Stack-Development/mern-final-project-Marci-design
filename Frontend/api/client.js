import axios from 'axios';
import authStorage from '../auth/storage';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

apiClient.interceptors.request.use(async (config) => {
  const authToken = await authStorage.getToken();
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default apiClient;