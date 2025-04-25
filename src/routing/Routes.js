// src/Routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorSignUp from '../components/auth/DoctorSignUp';// Adjust path if needed
import DoctorLogin from '../components/auth/DoctorLogIn';   // Adjust path if needed
import Dashboard from '../components/dashboard/Dashboard';     // Adjust

const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
    return (
        <Routes>
            <Route path="/signup" element={<DoctorSignUp />} />
            <Route path="/login" element={<DoctorLogin />} />
            <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default AppRoutes;