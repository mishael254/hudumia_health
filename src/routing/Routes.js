// src/Routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorSignUp from '../components/auth/DoctorSignUp';// Adjust path if needed
import DoctorLogin from '../components/auth/DoctorLogIn';   // Adjust path if needed
import Dashboard from '../components/dashboard/Dashboard';     // Adjust
import LandingPage from '../components/navbars/home/LandingPage';
import ClientDashboard from '../components/dashboard/components/clients/ClientDashboard';
const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
    return (
        <Routes>
            <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />}
            />
            <Route path="/signup" element={<DoctorSignUp />} />
            <Route path="/login" element={<DoctorLogin setIsAuthenticated={setIsAuthenticated} />} />
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/clients" element={<ClientDashboard />} />
            
        </Routes>
    );
};

export default AppRoutes;