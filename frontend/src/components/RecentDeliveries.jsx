import React from 'react';
import { FiEye, FiMoreVertical } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const RecentDeliveries = ({ deliveries = [] }) => {
  const navigate = useNavigate();
  
  // Show only first 5 recent deliveries
  const recentDeliveries = deliveries.slice(0, 5);

  const handleView = (deliveryId) => {
    navigate(`/deliveries?view=${deliveryId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {recentDeliveries.length > 0 ? (
            recentDeliveries.map((delivery) => (
              <tr
                key={delivery._id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{delivery.orderId}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{delivery.customerName}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      delivery.status
                    )}`}
                  >
                    {delivery.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {new Date(delivery.deliveryDate).toLocaleDateString('en-IN')}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleView(delivery._id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FiEye className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-8 text-center text-gray-500">
                No recent deliveries found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentDeliveries;
