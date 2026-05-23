import React, { useContext, useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiEdit, FiSave, FiX } from 'react-icons/fi';
import MainLayout from '../layouts/MainLayout';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ phone: user?.phone || '' });
  };

  const handleSave = async () => {
    // Validate phone number (10 digits only)
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      setToast({ type: 'error', message: 'Phone number must be exactly 10 digits' });
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
      const response = await updateProfile({ phone: cleanPhone });
      
      console.log('Profile update response:', response);
      
      // Update user context with the new phone number from response
      updateUser(response);
      
      setToast({ type: 'success', message: 'Phone number updated successfully' });
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setToast({ type: 'error', message: error.response?.data?.message || 'Failed to update phone number' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FiUser className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
                <p className="text-blue-100 capitalize">{user?.role || 'Driver'}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              {/* Driver UID - Prominently displayed */}
              {user?.driverUid && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <FiCreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-700">Driver UID</p>
                      <p className="text-2xl font-bold text-blue-900 font-mono">{user.driverUid}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-blue-600">
                    This is your unique identifier. Admin will use this UID to assign deliveries to you.
                  </p>
                </div>
              )}

              {/* Name */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <FiUser className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-medium text-gray-900">{user?.name || 'N/A'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <FiMail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-lg font-medium text-gray-900">{user?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <FiPhone className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-lg font-medium text-gray-900">{user?.phone || 'N/A'}</p>
                  )}
                </div>
                <button
                  onClick={isEditing ? handleCancel : handleEdit}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title={isEditing ? 'Cancel' : 'Edit'}
                >
                  {isEditing ? <FiX className="w-5 h-5 text-gray-500" /> : <FiEdit className="w-5 h-5 text-gray-500" />}
                </button>
              </div>

              {/* Save button when editing */}
              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

export default Profile;
