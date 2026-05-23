import api from './authService';

// Get all vehicles
export const getVehicles = async (params = {}) => {
  const response = await api.get('/vehicles', { params });
  return response.data;
};

// Get single vehicle
export const getVehicleById = async (id) => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

// Create new vehicle
export const createVehicle = async (vehicleData) => {
  const response = await api.post('/vehicles', vehicleData);
  return response.data;
};

// Update vehicle
export const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(`/vehicles/${id}`, vehicleData);
  return response.data;
};

// Update vehicle availability
export const updateVehicleAvailability = async (id, availability) => {
  const response = await api.patch(`/vehicles/${id}/availability`, { availability });
  return response.data;
};

// Delete vehicle
export const deleteVehicle = async (id) => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};

// Get vehicle statistics
export const getVehicleStats = async () => {
  const response = await api.get('/vehicles/stats/summary');
  return response.data;
};
