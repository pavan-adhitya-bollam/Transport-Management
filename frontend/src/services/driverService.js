import api from './authService';

// Get all drivers
export const getDrivers = async (params = {}) => {
  const response = await api.get('/drivers', { params });
  return response.data;
};

// Get single driver
export const getDriverById = async (id) => {
  const response = await api.get(`/drivers/${id}`);
  return response.data;
};

// Create new driver
export const createDriver = async (driverData) => {
  const response = await api.post('/drivers', driverData);
  return response.data;
};

// Update driver
export const updateDriver = async (id, driverData) => {
  const response = await api.put(`/drivers/${id}`, driverData);
  return response.data;
};

// Update driver availability
export const updateDriverAvailability = async (id, availability) => {
  const response = await api.patch(`/drivers/${id}/availability`, { availability });
  return response.data;
};

// Delete driver
export const deleteDriver = async (id) => {
  const response = await api.delete(`/drivers/${id}`);
  return response.data;
};

// Get driver statistics
export const getDriverStats = async () => {
  const response = await api.get('/drivers/stats/summary');
  return response.data;
};
