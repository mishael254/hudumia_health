import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/" replace />;
  }

  // Otherwise, show the protected content
  return children;
};

export default ProtectedRoute;
