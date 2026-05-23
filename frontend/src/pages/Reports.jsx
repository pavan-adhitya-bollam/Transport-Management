import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { getDeliveryStats, getMonthlyStats, getDriverPerformance, getVehicleUsage } from '../services/reportService';
import MonthlyStatsChart from '../components/MonthlyStatsChart';
import DriverPerformanceChart from '../components/DriverPerformanceChart';
import VehicleUsageChart from '../components/VehicleUsageChart';

const Reports = () => {
  const [deliveryStats, setDeliveryStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [driverPerformance, setDriverPerformance] = useState([]);
  const [vehicleUsage, setVehicleUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [stats, monthly, drivers, vehicles] = await Promise.all([
        getDeliveryStats(),
        getMonthlyStats(),
        getDriverPerformance(),
        getVehicleUsage(),
      ]);

      setDeliveryStats(stats);
      setMonthlyStats(monthly);
      setDriverPerformance(drivers);
      setVehicleUsage(vehicles);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Analytics and performance insights</p>
        </div>

        {/* Delivery Statistics Cards */}
        {deliveryStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Deliveries</p>
              <p className="text-3xl font-bold text-gray-900">{deliveryStats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{deliveryStats.pending}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">In Transit</p>
              <p className="text-3xl font-bold text-blue-600">{deliveryStats.inTransit}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-500 mb-1">Delivered</p>
              <p className="text-3xl font-bold text-green-600">{deliveryStats.delivered}</p>
            </div>
          </div>
        )}

        {/* Monthly Statistics Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Delivery Statistics</h2>
          <MonthlyStatsChart data={monthlyStats} />
        </div>

        {/* Driver Performance and Vehicle Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Performance</h2>
            <DriverPerformanceChart data={driverPerformance} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Usage</h2>
            <VehicleUsageChart data={vehicleUsage} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
