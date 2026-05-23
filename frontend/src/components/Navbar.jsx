import React, { useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Navigate to deliveries page with search query
    if (e.target.value.trim()) {
      navigate(`/deliveries?search=${encodeURIComponent(e.target.value)}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/deliveries?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 z-30">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side - Menu button and Search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-80">
            <FiSearch className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search deliveries by Order ID, Customer Name..."
              className="bg-transparent border-none outline-none text-sm w-full"
              title="Search deliveries by Order ID or Customer Name"
            />
          </form>
        </div>

        {/* Right side - Notifications and User */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiBell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">New delivery assigned</p>
                    <p className="text-xs text-gray-500 mt-1">ORD-1050 assigned to DRV-1VMJ3Z</p>
                    <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Delivery status updated</p>
                    <p className="text-xs text-gray-500 mt-1">ORD-1049 marked as Delivered</p>
                    <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900">Vehicle assigned</p>
                    <p className="text-xs text-gray-500 mt-1">TRK-005 assigned to DRV-1VMJ3Z</p>
                    <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-200">
                  <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => navigate('/profile')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Profile Settings"
          >
            <FiSettings className="w-6 h-6 text-gray-600" />
          </button>

          {/* User profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Driver'}</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
