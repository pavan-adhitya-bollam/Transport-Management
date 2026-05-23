import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';

const DeliveryList = ({
  deliveries,
  onEdit,
  onDelete,
  onView,
  onStatusUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredDeliveries, setFilteredDeliveries] = useState(deliveries);

  useEffect(() => {
    let filtered = deliveries;

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter((delivery) => delivery.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (delivery) =>
          delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDeliveries(filtered);
  }, [deliveries, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'In Transit':
        return 'bg-purple-100 text-purple-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusChange = (deliveryId, newStatus) => {
    onStatusUpdate(deliveryId, newStatus);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by customer, order ID, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Address
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Driver
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Vehicle
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-500">
                  No deliveries found
                </td>
              </tr>
            ) : (
              filteredDeliveries.map((delivery) => (
                <tr
                  key={delivery._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {delivery.orderId}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div>
                      <p className="font-medium">{delivery.customerName}</p>
                      <p className="text-gray-500 text-xs">{delivery.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 max-w-xs truncate">
                    {delivery.deliveryAddress}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {delivery.assignedDriver ? delivery.assignedDriver : 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {delivery.assignedVehicle || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div>
                      <p>{new Date(delivery.deliveryDate).toLocaleDateString('en-IN')}</p>
                      <p className="text-gray-500 text-xs">{delivery.deliveryTime}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={delivery.status}
                      onChange={(e) => handleStatusChange(delivery._id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(
                        delivery.status
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onView(delivery)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => onEdit(delivery)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => onDelete(delivery)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination info */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredDeliveries.length} of {deliveries.length} deliveries
        </p>
      </div>
    </div>
  );
};

export default DeliveryList;
