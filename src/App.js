import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routing/Routes'; // Import the AppRoutes component
import HomeNavbar from './components/navbars/home/HomeNavbar';
import DashboardNavbar from './components/navbars/dashboard/DashboardNavbar';

// NavbarWrapper component to conditionally render the appropriate navbar
const NavbarWrapper = ({ isAuthenticated }) => {
  const location = useLocation();
  
  // Check if the current path is the dashboard
  const isDashboardRoute = location.pathname === '/dashboard';
  
  // Show DashboardNavbar if authenticated and on dashboard route, otherwise show HomeNavbar
  return isDashboardRoute && isAuthenticated ? <DashboardNavbar /> : <HomeNavbar />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
};

// Separate component to use hooks that require Router context
const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <div>
      {/* Navbar */}
      <NavbarWrapper isAuthenticated={isAuthenticated} />

      {/* Routes */}
      <AppRoutes isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </div>
  );
};

export default App;
