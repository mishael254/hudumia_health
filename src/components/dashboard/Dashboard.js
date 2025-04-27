import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBIcon
} from 'mdb-react-ui-kit';
import { 
  getPrograms, 
  getClients, 
  getDashboardStats, 
  getRecentEnrollments,
  createProgram,
  createClient,
  enrollClientInProgram,
  getClientEnrollments
} from '../../services/Api';

// Import components
import StatisticsCard from './components/StatisticsCard';
import SearchClients from './components/SearchClients';
import RecentEnrollments from './components/RecentEnrollments';
import QuickActions from './components/QuickActions';
import ClientModal from './components/ClientModal';
import ProgramModal from './components/ProgramModal';
import EnrollmentModal from './components/EnrollmentModal';
import ViewClientModal from './components/ViewClientModal';
import APIDocModal from './components/APIDocModal';
import Notification from './components/Notification';
import Sidebar from '../sidebars/Sidebar';
import './Dashboard.css';

function Dashboard() {
  // State for tabs
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for data
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0,
    totalEnrollments: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClientEnrollments, setSelectedClientEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for modals
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showViewClientModal, setShowViewClientModal] = useState(false);
  const [showAPIDocModal, setShowAPIDocModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State for notifications
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info'
  });

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from API
        const [statsData, enrollmentsData, programsData, clientsData] = await Promise.all([
          getDashboardStats(),
          getRecentEnrollments(5),
          getPrograms(),
          getClients()
        ]);
        
        setStats(statsData);
        setRecentEnrollments(enrollmentsData);
        
        // Process programs data to include enrolled clients count
        const processedPrograms = programsData.map(program => ({
          ...program,
          enrolledClients: Math.floor(Math.random() * 15) + 1 // Placeholder until we have real data
        }));
        setPrograms(processedPrograms);
        
        // Process clients data to format for display
        const processedClients = clientsData.map(client => ({
          id: client.id,
          name: `${client.first_name} ${client.second_name} ${client.sir_name}`,
          gender: client.gender,
          dob: client.date_of_birth,
          phone: client.phone_number,
          address: client.address || 'N/A',
          email: client.email || 'N/A',
          programs: Math.floor(Math.random() * 3) + 1 // Placeholder until we have real data
        }));
        setClients(processedClients);
        setFilteredClients(processedClients);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
        showNotification('Failed to load dashboard data. Please try again later.', 'error');
      }
    };

    fetchDashboardData();
  }, []);
  
  // Handle tab change
  const handleTabClick = (tabId) => {
    if (activeTab !== tabId) {
      setActiveTab(tabId);
    }
  };
  
  // Handle search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredClients(clients);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = clients.filter(client => 
      client.name.toLowerCase().includes(term) || 
      (client.phone && client.phone.toLowerCase().includes(term))
    );
    
    setFilteredClients(filtered);
  };
  
  // Handle client actions
  const handleViewClient = async (client) => {
    setSelectedClient(client);
    try {
      // Fetch client enrollments
      const enrollments = await getClientEnrollments(client.id);
      setSelectedClientEnrollments(enrollments);
    } catch (error) {
      console.error('Error fetching client enrollments:', error);
      setSelectedClientEnrollments([]);
    }
    setShowViewClientModal(true);
  };
  
  const handleRegisterClient = () => {
    setIsEditMode(false);
    setSelectedClient(null);
    setShowClientModal(true);
  };
  
  const handleClientSubmit = async (clientData) => {
    try {
      await createClient(clientData);
      setShowClientModal(false);
      
      // Refresh clients list
      const clientsData = await getClients();
      const processedClients = clientsData.map(client => ({
        id: client.id,
        name: `${client.first_name} ${client.second_name} ${client.sir_name}`,
        gender: client.gender,
        dob: client.date_of_birth,
        phone: client.phone_number,
        address: client.address || 'N/A',
        email: client.email || 'N/A',
        programs: 0 // New client has no enrollments
      }));
      setClients(processedClients);
      setFilteredClients(processedClients);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalClients: prev.totalClients + 1
      }));
      
      showNotification('Client registered successfully!', 'success');
    } catch (error) {
      console.error('Error creating client:', error);
      showNotification('Failed to register client: ' + error.message, 'error');
    }
  };
  
  // Handle program actions
  const handleCreateProgram = () => {
    setIsEditMode(false);
    setShowProgramModal(true);
  };
  
  const handleProgramSubmit = async (programData) => {
    try {
      await createProgram(programData);
      setShowProgramModal(false);
      
      // Refresh programs list
      const programsData = await getPrograms();
      const processedPrograms = programsData.map(program => ({
        ...program,
        enrolledClients: 0 // New program has no enrollments
      }));
      setPrograms(processedPrograms);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalPrograms: prev.totalPrograms + 1
      }));
      
      showNotification('Health program created successfully!', 'success');
    } catch (error) {
      console.error('Error creating program:', error);
      showNotification('Failed to create program: ' + error.message, 'error');
    }
  };
  
  // Handle enrollment actions
  const handleEnrollClient = (client = null) => {
    if (client) {
      setSelectedClient(client);
    }
    setShowEnrollmentModal(true);
  };
  
  const handleEnrollmentSubmit = async (enrollmentData) => {
    try {
      await enrollClientInProgram(enrollmentData);
      setShowEnrollmentModal(false);
      
      // Refresh enrollments
      const enrollmentsData = await getRecentEnrollments(5);
      setRecentEnrollments(enrollmentsData);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalEnrollments: prev.totalEnrollments + 1
      }));
      
      showNotification('Client enrolled successfully!', 'success');
    } catch (error) {
      console.error('Error creating enrollment:', error);
      showNotification('Failed to enroll client: ' + error.message, 'error');
    }
  };
  
  // Handle API documentation
  const handleViewAPI = () => {
    setShowAPIDocModal(true);
  };
  
  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  if (loading) {
    return (
      <MDBContainer className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </MDBContainer>
    );
  }

  if (error) {
    return (
      <MDBContainer className="py-5 text-center">
        <MDBIcon fas icon="exclamation-triangle" size="3x" className="text-warning mb-3" />
        <p className="lead">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </MDBContainer>
    );
  }

  return (
    <>
      <MDBContainer fluid className="py-4">
        {/* Dashboard Header */}
        <Sidebar />
        <MDBRow className="mb-4">
          <MDBCol>
            <h2 className="fw-bold">
              <MDBIcon fas icon="clinic-medical" className="me-2 text-primary" />
              Doctor Dashboard
            </h2>
            <p className="text-muted">
              Welcome to HudumiaHealth Portal. Manage your clients and health programs.
            </p>
          </MDBCol>
        </MDBRow>

        {/* Dashboard Navigation */}
        <MDBTabs pills className="mb-4">
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('overview')}
              active={activeTab === 'overview'}
            >
              <MDBIcon fas icon="chart-line" className="me-2" />
              Overview
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('programs')}
              active={activeTab === 'programs'}
            >
              <MDBIcon fas icon="clipboard-list" className="me-2" />
              Programs
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('clients')}
              active={activeTab === 'clients'}
            >
              <MDBIcon fas icon="users" className="me-2" />
              Clients
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('enrollments')}
              active={activeTab === 'enrollments'}
            >
              <MDBIcon fas icon="file-medical" className="me-2" />
              Enrollments
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => handleTabClick('api')}
              active={activeTab === 'api'}
            >
              <MDBIcon fas icon="plug" className="me-2" />
              API
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          {/* Overview Tab */}
          <MDBTabsPane show={activeTab === 'overview'}>
            {/* Stats Cards */}
            <div className="dashboard-cards">
              <StatisticsCard 
                title="Total Clients" 
                count={stats.totalClients} 
                icon="users" 
                iconColor="clients" 
                subtitle="Registered" 
              />
              
              <StatisticsCard 
                title="Health Programs" 
                count={stats.totalPrograms} 
                icon="clipboard-list" 
                iconColor="programs" 
                subtitle="Active" 
              />
              
              <StatisticsCard 
                title="Enrollments" 
                count={stats.totalEnrollments} 
                icon="file-medical" 
                iconColor="enrollments" 
                subtitle="Total" 
              />
            </div>

            {/* Search Clients */}
            <SearchClients 
              clients={filteredClients} 
              onSearch={handleSearch} 
              onViewClient={handleViewClient} 
              onEnrollClient={handleEnrollClient} 
            />

            {/* Quick Actions */}
            <QuickActions 
              onRegisterClient={handleRegisterClient} 
              onCreateProgram={handleCreateProgram} 
              onEnrollClient={handleEnrollClient} 
              onViewAPI={handleViewAPI} 
            />
          </MDBTabsPane>

          {/* Programs Tab */}
          <MDBTabsPane show={activeTab === 'programs'}>
            {/* Programs content will go here */}
            <MDBRow className="mb-4">
              <MDBCol>
                <h3>Health Programs</h3>
                <p>Manage your health programs here.</p>
              </MDBCol>
            </MDBRow>
          </MDBTabsPane>

          {/* Clients Tab */}
          <MDBTabsPane show={activeTab === 'clients'}>
            {/* Clients content will go here */}
            <MDBRow className="mb-4">
              <MDBCol>
                <h3>Client Management</h3>
                <p>Manage your clients here.</p>
              </MDBCol>
            </MDBRow>
          </MDBTabsPane>

          {/* Enrollments Tab */}
          <MDBTabsPane show={activeTab === 'enrollments'}>
            {/* Enrollments content will go here */}
            <MDBRow className="mb-4">
              <MDBCol>
                <RecentEnrollments 
                  enrollments={recentEnrollments} 
                  onViewEnrollment={() => {}} 
                  onEditEnrollment={() => {}} 
                  onDeleteEnrollment={() => {}} 
                />
              </MDBCol>
            </MDBRow>
          </MDBTabsPane>

          {/* API Tab */}
          <MDBTabsPane show={activeTab === 'api'}>
            {/* API content will go here */}
            <MDBRow className="mb-4">
              <MDBCol>
                <h3>API Documentation</h3>
                <p>Access the API documentation here.</p>
                <button className="btn btn-primary" onClick={handleViewAPI}>
                  View API Documentation
                </button>
              </MDBCol>
            </MDBRow>
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
      
      {/* Modals */}
      <ClientModal 
        show={showClientModal} 
        setShow={setShowClientModal} 
        client={selectedClient} 
        onSubmit={handleClientSubmit} 
        isEdit={isEditMode} 
      />
      
      <ProgramModal 
        show={showProgramModal} 
        setShow={setShowProgramModal} 
        onSubmit={handleProgramSubmit} 
        isEdit={isEditMode} 
      />
      
      <EnrollmentModal 
        show={showEnrollmentModal} 
        setShow={setShowEnrollmentModal} 
        clients={clients} 
        programs={programs} 
        onSubmit={handleEnrollmentSubmit} 
        isEdit={isEditMode} 
      />
      
      <ViewClientModal 
        show={showViewClientModal} 
        setShow={setShowViewClientModal} 
        client={selectedClient} 
        enrollments={selectedClientEnrollments} 
      />
      
      <APIDocModal 
        show={showAPIDocModal} 
        setShow={setShowAPIDocModal} 
      />
      
      {/* Notification */}
      <Notification 
        notification={notification} 
        setNotification={setNotification} 
      />
    </>
  );
}

export default Dashboard;
