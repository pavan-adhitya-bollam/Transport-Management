import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import DashboardHome from './pages/DashboardHome';
import Deliveries from './pages/Deliveries';
import Drivers from './pages/Drivers';
import Vehicles from './pages/Vehicles';
import Schedule from './pages/Schedule';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'admin' ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/driver/dashboard" replace />
  );
};

// Placeholder components for other pages (will be built later)
const PlaceholderPage = ({ title }) => (
  <MainLayout>
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">This page is under construction. Features coming soon.</p>
    </div>
  </MainLayout>
);

const Unauthorized = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
      <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Dashboard redirect based on role */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          
          {/* Protected routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <MainLayout>
                  <DashboardHome />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute requiredRole="driver">
                <MainLayout>
                  <DashboardHome />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Other protected routes with placeholder pages */}
          <Route
            path="/deliveries"
            element={
              <ProtectedRoute>
                <Deliveries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <ProtectedRoute>
                <Drivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
