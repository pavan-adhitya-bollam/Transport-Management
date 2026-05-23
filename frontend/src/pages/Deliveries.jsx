import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import DeliveryList from '../components/DeliveryList';
import AddDeliveryModal from '../components/AddDeliveryModal';
import EditDeliveryModal from '../components/EditDeliveryModal';
import DeleteConfirmation from '../components/DeleteConfirmation';
import Toast from '../components/Toast';
import { DeliveryListSkeleton } from '../components/LoadingSkeleton';
import { EmptyDeliveries } from '../components/EmptyState';
import { AuthContext } from '../context/AuthContext';
import {
  getDeliveries,
  createDelivery,
  updateDelivery,
  updateDeliveryStatus,
  deleteDelivery,
} from '../services/deliveryService';
import { getDrivers } from '../services/driverService';

const Deliveries = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [toast, setToast] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const isAdmin = user?.role === 'admin';
  const searchQuery = searchParams.get('search') || '';

  // Fetch deliveries and drivers on component mount
  useEffect(() => {
    fetchDeliveries();
    fetchDrivers();
  }, [searchQuery]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const data = await getDeliveries();
      
      // Filter deliveries: admin sees all, drivers see only their assigned deliveries by UID
      let filteredDeliveries = isAdmin
        ? data
        : data.filter((delivery) => delivery.assignedDriver === user?.driverUid);
      
      // Apply search filter if search query exists
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredDeliveries = filteredDeliveries.filter((delivery) =>
          delivery.orderId?.toLowerCase().includes(query) ||
          delivery.customerName?.toLowerCase().includes(query) ||
          delivery.deliveryAddress?.toLowerCase().includes(query)
        );
      }
      
      setDeliveries(filteredDeliveries);
    } catch (error) {
      showToast('Error fetching deliveries', 'error');
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddDelivery = async (deliveryData) => {
    try {
      await createDelivery(deliveryData);
      showToast('Delivery added successfully', 'success');
      setShowAddModal(false);
      fetchDeliveries();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error adding delivery', 'error');
      console.error('Error adding delivery:', error);
    }
  };

  const handleEditDelivery = async (deliveryData) => {
    try {
      await updateDelivery(selectedDelivery._id, deliveryData);
      showToast('Delivery updated successfully', 'success');
      setShowEditModal(false);
      setSelectedDelivery(null);
      fetchDeliveries();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating delivery', 'error');
      console.error('Error updating delivery:', error);
    }
  };

  const handleDeleteDelivery = async () => {
    try {
      await deleteDelivery(selectedDelivery._id);
      showToast('Delivery deleted successfully', 'success');
      setShowDeleteModal(false);
      setSelectedDelivery(null);
      fetchDeliveries();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error deleting delivery', 'error');
      console.error('Error deleting delivery:', error);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      showToast('Status updated successfully', 'success');
      fetchDeliveries();
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating status', 'error');
      console.error('Error updating status:', error);
    }
  };

  const handleEditClick = (delivery) => {
    setSelectedDelivery(delivery);
    setShowEditModal(true);
  };

  const handleDeleteClick = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDeleteModal(true);
  };

  const handleViewClick = (delivery) => {
    // TODO: Implement view details modal or navigate to details page
    console.log('View delivery:', delivery);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deliveries</h1>
            <p className="text-gray-500 mt-1">Manage all delivery orders</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Delivery</span>
            </button>
          )}
        </div>

        {/* Delivery List */}
        {loading ? (
          <DeliveryListSkeleton />
        ) : deliveries.length === 0 ? (
          <EmptyDeliveries onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
        ) : (
          <DeliveryList
            deliveries={deliveries}
            onEdit={isAdmin ? handleEditClick : undefined}
            onDelete={isAdmin ? handleDeleteClick : undefined}
            onView={handleViewClick}
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </div>

      {/* Add Delivery Modal */}
      <AddDeliveryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddDelivery}
        drivers={drivers}
      />

      {/* Edit Delivery Modal */}
      <EditDeliveryModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDelivery(null);
        }}
        onSubmit={handleEditDelivery}
        delivery={selectedDelivery}
        drivers={drivers}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedDelivery(null);
        }}
        onConfirm={handleDeleteDelivery}
        itemName={selectedDelivery?.orderId}
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

export default Deliveries;
