import apiClient from '../api/client';

const purchaseTicket = async (ticketData) => {
  try {
    const response = await apiClient.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to purchase ticket');
  }
};

const getUserTickets = async () => {
  try {
    const response = await apiClient.get('/tickets');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch tickets');
  }
};

const getTicketById = async (id) => {
  try {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch ticket');
  }
};

export default {
  purchaseTicket,
  getUserTickets,
  getTicketById,
};