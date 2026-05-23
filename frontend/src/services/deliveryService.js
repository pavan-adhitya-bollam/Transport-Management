import api from './authService';

// Get all deliveries
export const getDeliveries = async (params = {}) => {
  const response = await api.get('/deliveries', { params });
  return response.data;
};

// Get single delivery
export const getDeliveryById = async (id) => {
  const response = await api.get(`/deliveries/${id}`);
  return response.data;
};

// Create new delivery
export const createDelivery = async (deliveryData) => {
  const response = await api.post('/deliveries', deliveryData);
  return response.data;
};

// Update delivery
export const updateDelivery = async (id, deliveryData) => {
  const response = await api.put(`/deliveries/${id}`, deliveryData);
  return response.data;
};

// Update delivery status
export const updateDeliveryStatus = async (id, status) => {
  const response = await api.patch(`/deliveries/${id}/status`, { status });
  return response.data;
};

// Delete delivery
export const deleteDelivery = async (id) => {
  const response = await api.delete(`/deliveries/${id}`);
  return response.data;
};

// Get delivery statistics
export const getDeliveryStats = async () => {
  const response = await api.get('/deliveries/stats/summary');
  return response.data;
};
