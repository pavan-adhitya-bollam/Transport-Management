import React, { useState, useEffect, useContext } from 'react';
import AnalyticsCard from '../components/AnalyticsCard';
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiUsers,
} from 'react-icons/fi';
import DeliveryChart from '../components/DeliveryChart';
import RecentDeliveries from '../components/RecentDeliveries';
import { PageSkeleton, AnalyticsCardSkeleton } from '../components/LoadingSkeleton';
import { AuthContext } from '../context/AuthContext';
import { getDeliveries } from '../services/deliveryService';
import { getDrivers } from '../services/driverService';
import { getVehicles } from '../services/vehicleService';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [deliveryData, driverData, vehicleData] = await Promise.all([
        getDeliveries(),
        isAdmin ? getDrivers() : [],
        isAdmin ? getVehicles() : [],
      ]);

      // Filter deliveries for drivers by UID
      const filteredDeliveries = isAdmin
        ? deliveryData
        : deliveryData.filter((delivery) => delivery.assignedDriver === user?.driverUid);

      setDeliveries(filteredDeliveries);
      setDrivers(driverData);
      setVehicles(vehicleData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics based on real data
  const analyticsData = [
    {
      title: isAdmin ? 'Total Deliveries' : 'My Deliveries',
      value: deliveries.length.toString(),
      icon: FiPackage,
      change: '+12.5%',
      changeType: 'increase',
      color: 'blue',
    },
    {
      title: 'Pending Deliveries',
      value: deliveries.filter((d) => d.status === 'Pending').length.toString(),
      icon: FiClock,
      change: '+5.2%',
      changeType: 'increase',
      color: 'orange',
    },
    {
      title: 'Delivered Orders',
      value: deliveries.filter((d) => d.status === 'Delivered').length.toString(),
      icon: FiCheckCircle,
      change: '+15.3%',
      changeType: 'increase',
      color: 'green',
    },
    ...(isAdmin
      ? [
          {
            title: 'Active Vehicles',
            value: vehicles.filter((v) => v.availability === 'In Use').length.toString(),
            icon: FiTruck,
            change: '-2.1%',
            changeType: 'decrease',
            color: 'purple',
          },
          {
            title: 'Available Drivers',
            value: drivers.filter((d) => d.availability === 'Available').length.toString(),
            icon: FiUsers,
            change: '+8.7%',
            changeType: 'increase',
            color: 'blue',
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your deliveries today.</p>
        {user?.driverUid && (
          <div className="mt-2 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-blue-700">Your Driver UID: </span>
            <span className="ml-2 text-sm font-bold text-blue-900">{user.driverUid}</span>
          </div>
        )}
      </div>

      {loading ? (
        <PageSkeleton />
      ) : (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {analyticsData.map((item, index) => (
              <AnalyticsCard
                key={index}
                title={item.title}
                value={item.value}
                icon={item.icon}
                change={item.change}
                changeType={item.changeType}
                color={item.color}
              />
            ))}
          </div>

          {/* Charts and Recent Deliveries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Statistics</h2>
              <DeliveryChart />
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isAdmin ? 'Recent Deliveries' : 'My Recent Deliveries'}
              </h2>
              <RecentDeliveries deliveries={deliveries} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
