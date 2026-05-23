import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FiPlus } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import TableList from '../components/TableList';
import FormModal from '../components/FormModal';
import DeleteConfirmation from '../components/DeleteConfirmation';
import Toast from '../components/Toast';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyVehicles } from '../components/EmptyState';
import { AuthContext } from '../context/AuthContext';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  updateVehicleAvailability,
  deleteVehicle,
} from '../services/vehicleService';

const Vehicles = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [toast, setToast] = useState(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehicles();
      setVehicles(data);
    } catch (error) {
      showToast('Error fetching vehicles', 'error');
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const vehicleFields = useMemo(() => [
    {
      name: 'vehicleNumber',
      label: 'Vehicle Number',
      type: 'text',
      required: true,
      placeholder: 'e.g., VH-001',
    },
    {
      name: 'vehicleType',
      label: 'Vehicle Type',
      type: 'select',
      required: true,
      defaultValue: 'Truck',
      options: [
        { value: 'Truck', label: 'Truck' },
        { value: 'Van', label: 'Van' },
        { value: 'Motorcycle', label: 'Motorcycle' },
        { value: 'Car', label: 'Car' },
        { value: 'Other', label: 'Other' },
      ],
    },
    {
      name: 'capacity',
      label: 'Capacity',
      type: 'text',
      required: true,
      placeholder: 'e.g., 500kg, 2 tons',
    },
    {
      name: 'availability',
      label: 'Availability',
      type: 'select',
      required: true,
      defaultValue: 'Available',
      options: [
        { value: 'Available', label: 'Available' },
        { value: 'In Use', label: 'In Use' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Unavailable', label: 'Unavailable' },
      ],
    },
  ], []);

  const handleAddVehicle = async (vehicleData) => {
    try {
      await createVehicle(vehicleData);
      showToast('Vehicle added successfully', 'success');
      setShowAddModal(false);
      fetchVehicles();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error adding vehicle', 'error');
      console.error('Error adding vehicle:', error);
    }
  };

  const handleEditVehicle = async (vehicleData) => {
    try {
      await updateVehicle(selectedVehicle._id, vehicleData);
      showToast('Vehicle updated successfully', 'success');
      setShowEditModal(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating vehicle', 'error');
      console.error('Error updating vehicle:', error);
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      await deleteVehicle(selectedVehicle._id);
      showToast('Vehicle deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting vehicle', 'error');
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleAvailabilityUpdate = async (vehicleId, newAvailability) => {
    try {
      await updateVehicleAvailability(vehicleId, newAvailability);
      showToast('Availability updated successfully', 'success');
      fetchVehicles();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating availability', 'error');
      console.error('Error updating availability:', error);
    }
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const handleViewClick = (vehicle) => {
    console.log('View vehicle:', vehicle);
  };

  const columns = [
    { key: 'vehicleNumber', label: 'Vehicle Number' },
    { key: 'vehicleType', label: 'Type' },
    { key: 'capacity', label: 'Capacity' },
    {
      key: 'availability',
      label: 'Availability',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === 'Available'
              ? 'bg-green-100 text-green-700'
              : value === 'In Use'
              ? 'bg-blue-100 text-blue-700'
              : value === 'Maintenance'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'assignedDriver',
      label: 'Assigned Driver',
      render: (value) => (value ? value.name : 'Unassigned'),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
            <p className="text-gray-500 mt-1">Manage all vehicles</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Vehicle</span>
            </button>
          )}
        </div>

        {/* Vehicle List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <th key={i} className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <TableSkeleton rows={5} columns={5} />
              </tbody>
            </table>
          </div>
        ) : vehicles.length === 0 ? (
          <EmptyVehicles onAction={() => setShowAddModal(true)} />
        ) : (
          <TableList
            data={vehicles}
            columns={columns}
            onEdit={isAdmin ? handleEditClick : undefined}
            onDelete={isAdmin ? handleDeleteClick : undefined}
            onView={handleViewClick}
            searchPlaceholder="Search by vehicle number..."
            filterOptions={['Available', 'In Use', 'Maintenance', 'Unavailable']}
            filterLabel="Availability"
            statusColumn="availability"
            onStatusUpdate={isAdmin ? handleAvailabilityUpdate : undefined}
          />
        )}
      </div>

      {/* Add Vehicle Modal */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVehicle}
        title="Add New Vehicle"
        fields={vehicleFields}
      />

      {/* Edit Vehicle Modal */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVehicle(null);
        }}
        onSubmit={handleEditVehicle}
        title="Edit Vehicle"
        fields={vehicleFields}
        initialData={selectedVehicle}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedVehicle(null);
        }}
        onConfirm={handleDeleteVehicle}
        itemName={selectedVehicle?.vehicleNumber}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </MainLayout>
  );
};

export default Vehicles;
