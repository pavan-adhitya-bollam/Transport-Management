import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FiPlus } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import TableList from '../components/TableList';
import FormModal from '../components/FormModal';
import DeleteConfirmation from '../components/DeleteConfirmation';
import Toast from '../components/Toast';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { EmptyDrivers } from '../components/EmptyState';
import { AuthContext } from '../context/AuthContext';
import {
  getDrivers,
  createDriver,
  updateDriver,
  updateDriverAvailability,
  deleteDriver,
} from '../services/driverService';

const Drivers = () => {
  const { user } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [toast, setToast] = useState(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      showToast('Error fetching drivers', 'error');
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const driverFields = useMemo(() => [
    {
      name: 'name',
      label: 'Driver Name',
      type: 'text',
      required: true,
      placeholder: 'Enter driver name',
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: 'e.g., 1234567890',
      validation: (value) => {
        if (!/^\d{10,}$/.test(value.replace(/[-\s]/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return null;
      },
    },
    {
      name: 'licenseNumber',
      label: 'License Number',
      type: 'text',
      required: true,
      placeholder: 'e.g., DL-123456',
    },
    {
      name: 'availability',
      label: 'Availability',
      type: 'select',
      required: true,
      defaultValue: 'Available',
      options: [
        { value: 'Available', label: 'Available' },
        { value: 'On Duty', label: 'On Duty' },
        { value: 'Unavailable', label: 'Unavailable' },
      ],
    },
  ], []);

  const handleAddDriver = async (driverData) => {
    try {
      await createDriver(driverData);
      showToast('Driver added successfully', 'success');
      setShowAddModal(false);
      fetchDrivers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error adding driver', 'error');
      console.error('Error adding driver:', error);
    }
  };

  const handleEditDriver = async (driverData) => {
    try {
      await updateDriver(selectedDriver._id, driverData);
      showToast('Driver updated successfully', 'success');
      setShowEditModal(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating driver', 'error');
      console.error('Error updating driver:', error);
    }
  };

  const handleDeleteDriver = async () => {
    try {
      await deleteDriver(selectedDriver._id);
      showToast('Driver deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting driver', 'error');
      console.error('Error deleting driver:', error);
    }
  };

  const handleAvailabilityUpdate = async (driverId, newAvailability) => {
    try {
      await updateDriverAvailability(driverId, newAvailability);
      showToast('Availability updated successfully', 'success');
      fetchDrivers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating availability', 'error');
      console.error('Error updating availability:', error);
    }
  };

  const handleEditClick = (driver) => {
    setSelectedDriver(driver);
    setShowEditModal(true);
  };

  const handleDeleteClick = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  const handleViewClick = (driver) => {
    console.log('View driver:', driver);
  };

  const columns = [
    { key: 'uid', label: 'Driver UID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'licenseNumber', label: 'License Number' },
    {
      key: 'availability',
      label: 'Availability',
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === 'Available'
              ? 'bg-green-100 text-green-700'
              : value === 'On Duty'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
            <p className="text-gray-500 mt-1">Manage all drivers</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Driver</span>
            </button>
          )}
        </div>

        {/* Driver List */}
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
        ) : drivers.length === 0 ? (
          <EmptyDrivers onAction={() => setShowAddModal(true)} />
        ) : (
          <TableList
            data={drivers}
            columns={columns}
            onEdit={isAdmin ? handleEditClick : undefined}
            onDelete={isAdmin ? handleDeleteClick : undefined}
            onView={handleViewClick}
            searchPlaceholder="Search by name or license number..."
            filterOptions={['Available', 'On Duty', 'Unavailable']}
            filterLabel="Availability"
            statusColumn="availability"
            onStatusUpdate={isAdmin ? handleAvailabilityUpdate : undefined}
          />
        )}
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <FormModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDriver}
          title="Add New Driver"
          fields={driverFields}
        />
      )}

      {/* Edit Driver Modal */}
      {showEditModal && (
        <FormModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDriver(null);
          }}
          onSubmit={handleEditDriver}
          title="Edit Driver"
          fields={driverFields}
          initialData={selectedDriver}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDriver(null);
        }}
        onConfirm={handleDeleteDriver}
        itemName={selectedDriver?.name}
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

export default Drivers;
