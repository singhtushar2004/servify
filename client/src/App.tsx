import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookingHistory from './pages/customer/BookingHistory';
import ServiceDetails from './pages/customer/ServiceDetails';
import CustomerProfile from './pages/customer/CustomerProfile';

import ProviderDashboard from './pages/provider/ProviderDashboard';
import EarningsAnalytics from './pages/provider/EarningsAnalytics';
import ActiveJobs from './pages/provider/ActiveJobs';
import CompletedJobs from './pages/provider/CompletedJobs';
import ProviderProfile from './pages/provider/ProviderProfile';

import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  role?: 'customer' | 'provider';
}> = ({ children, role }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'provider' ? '/provider/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'provider' ? '/provider/dashboard' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Customer Routes */}
      <Route path="/dashboard" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute role="customer"><BookingHistory /></ProtectedRoute>} />
      <Route path="/services/:id" element={<ProtectedRoute role="customer"><ServiceDetails /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute role="customer"><CustomerProfile /></ProtectedRoute>} />

      {/* Provider Routes */}
      <Route path="/provider/dashboard" element={<ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/provider/earnings" element={<ProtectedRoute role="provider"><EarningsAnalytics /></ProtectedRoute>} />
      <Route path="/provider/jobs/active" element={<ProtectedRoute role="provider"><ActiveJobs /></ProtectedRoute>} />
      <Route path="/provider/jobs/completed" element={<ProtectedRoute role="provider"><CompletedJobs /></ProtectedRoute>} />
      <Route path="/provider/profile" element={<ProtectedRoute role="provider"><ProviderProfile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
