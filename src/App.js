import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routing/Routes'; // Import the AppRoutes component
import HomeNavbar from './components/navbars/home/HomeNavbar';
//import DashboardNavbar from './components/navbars/dashboard/Topbar';
import Topbar from './components/navbars/dashboard/Topbar';
// NavbarWrapper component to conditionally render the appropriate navbar
//import DoctorLogIn from './components/auth/DoctorLogIn';
const NavbarWrapper = ({ isAuthenticated }) => {
  const location = useLocation();
  
  // Check if the current path is the dashboard
  const isDashboardRoute = location.pathname === '/dashboard';
  
  // Show DashboardNavbar if authenticated and on dashboard route, otherwise show HomeNavbar
  return isDashboardRoute && isAuthenticated ? <Topbar /> : <HomeNavbar />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  

  useEffect(() => {
    // Check for token on mount and set authentication state
    const checkAuth = () => {
      const token = localStorage.getItem('hudumia_health_token');
      setIsAuthenticated(!!token);
    };
    
    // Initial check
    checkAuth();
    
    // Set up event listener for storage changes (for multi-tab support)
    window.addEventListener('storage', checkAuth);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
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
