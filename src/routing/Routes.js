// src/Routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorSignUp from '../components/auth/DoctorSignUp';
import DoctorLogin from '../components/auth/DoctorLogIn';
import Dashboard from '../components/dashboard/Dashboard';
import LandingPage from '../components/navbars/home/LandingPage';
import ClientDashboard from '../components/dashboard/components/clients/ClientDashboard';
import ProtectedRoute from './ProtectedRoute';
import ClientTable from '../components/dashboard/components/clients/ClientTable';

const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
      />
      <Route path="/signup" element={<DoctorSignUp />} />
      <Route 
        path="/login" 
        element={<DoctorLogin setIsAuthenticated={setIsAuthenticated} />} 
      />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/clients" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ClientDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/clients-table" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ClientTable />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
