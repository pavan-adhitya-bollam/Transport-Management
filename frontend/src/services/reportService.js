import api from './authService';

// Get delivery statistics
export const getDeliveryStats = async (params = {}) => {
  const response = await api.get('/reports/delivery-stats', { params });
  return response.data;
};

// Get monthly statistics
export const getMonthlyStats = async (params = {}) => {
  const response = await api.get('/reports/monthly-stats', { params });
  return response.data;
};

// Get driver performance
export const getDriverPerformance = async () => {
  const response = await api.get('/reports/driver-performance');
  return response.data;
};

// Get vehicle usage
export const getVehicleUsage = async () => {
  const response = await api.get('/reports/vehicle-usage');
  return response.data;
};

// Get schedule data
export const getSchedule = async (params = {}) => {
  const response = await api.get('/reports/schedule', { params });
  return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const response = await api.get('/reports/dashboard-stats');
  return response.data;
};
