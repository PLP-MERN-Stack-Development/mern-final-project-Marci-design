import apiClient from '../api/client';

const getWalletBalance = async () => {
  try {
    const response = await apiClient.get('/payments/balance');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch wallet balance');
  }
};

const topUpWallet = async (topUpData) => {
  try {
    const response = await apiClient.post('/payments/topup', topUpData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to top up wallet');
  }
};

const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get('/payments/methods');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payment methods');
  }
};

const addPaymentMethod = async (methodData) => {
  try {
    const response = await apiClient.post('/payments/methods', methodData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add payment method');
  }
};

export default {
  getWalletBalance,
  topUpWallet,
  getPaymentMethods,
  addPaymentMethod,
};