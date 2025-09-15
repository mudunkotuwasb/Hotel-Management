import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import Dining from './pages/Dining';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import TripPackages from './pages/TripPackages';
import CustomerDashboard from './pages/CustomerDashboard';
import Unauthorized from './pages/Unauthorized';

const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // If user is authenticated, show appropriate dashboard
  if (user?.role === 'customer') {
    return <CustomerDashboard />;
  }

  // Staff users get the admin layout
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rooms" element={
          <ProtectedRoute allowedRoles={['admin', 'receptionist', 'housekeeping']}>
            <Rooms />
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <Bookings />
          </ProtectedRoute>
        } />
        <Route path="/dining" element={
          <ProtectedRoute allowedRoles={['admin', 'kitchen', 'receptionist']}>
            <Dining />
          </ProtectedRoute>
        } />
        <Route path="/trip-packages" element={
          <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <TripPackages />
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute allowedRoles={['admin', 'kitchen']}>
            <Inventory />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
            <Billing />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
