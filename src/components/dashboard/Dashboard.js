import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBTypography,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3004/api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0,
    totalEnrollments: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real implementation, these would be actual API calls
        // For now, we'll use mock data
        
        // Mock stats
        setStats({
          totalClients: 24,
          totalPrograms: 5,
          totalEnrollments: 32
        });
        
        // Mock recent enrollments
        setRecentEnrollments([
          { id: 1, clientName: 'John Doe', programName: 'Diabetes Management', date: '2025-04-20' },
          { id: 2, clientName: 'Jane Smith', programName: 'Hypertension Control', date: '2025-04-22' },
          { id: 3, clientName: 'Michael Johnson', programName: 'Maternal Care', date: '2025-04-23' },
          { id: 4, clientName: 'Sarah Williams', programName: 'Child Immunization', date: '2025-04-25' }
        ]);
        
        // Mock programs
        setPrograms([
          { id: 1, name: 'Diabetes Management', description: 'Comprehensive care for diabetes patients', enrolledClients: 8 },
          { id: 2, name: 'Hypertension Control', description: 'Blood pressure monitoring and management', enrolledClients: 12 },
          { id: 3, name: 'Maternal Care', description: 'Care for expectant mothers', enrolledClients: 6 },
          { id: 4, name: 'Child Immunization', description: 'Vaccination program for children', enrolledClients: 10 },
          { id: 5, name: 'Mental Health Support', description: 'Counseling and therapy services', enrolledClients: 4 }
        ]);
        
        // Mock clients
        setClients([
          { id: 1, name: 'John Doe', gender: 'Male', dob: '1985-06-15', phone: '+254712345678', programs: 2 },
          { id: 2, name: 'Jane Smith', gender: 'Female', dob: '1990-03-22', phone: '+254723456789', programs: 1 },
          { id: 3, name: 'Michael Johnson', gender: 'Male', dob: '1978-11-30', phone: '+254734567890', programs: 1 },
          { id: 4, name: 'Sarah Williams', gender: 'Female', dob: '1995-08-12', phone: '+254745678901', programs: 1 },
          { id: 5, name: 'David Brown', gender: 'Male', dob: '1982-04-05', phone: '+254756789012', programs: 2 }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTabClick = (tabId) => {
    if (activeTab !== tabId) {
      setActiveTab(tabId);
    }
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
        <MDBBtn color="primary" onClick={() => window.location.reload()}>
          Retry
        </MDBBtn>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer fluid className="py-4">
      {/* Dashboard Header */}
      <MDBRow className="mb-4">
        <MDBCol>
          <MDBTypography tag="h2" className="fw-bold">
            <MDBIcon fas icon="clinic-medical" className="me-2 text-primary" />
            Doctor Dashboard
          </MDBTypography>
          <p className="text-muted">
            Welcome to HudumiaHealth Portal. Manage your clients and health programs.
          </p>
        </MDBCol>
        <MDBCol className="text-end">
          <MDBBtn color="primary" className="me-2">
            <MDBIcon fas icon="user-plus" className="me-2" />
            New Client
          </MDBBtn>
          <MDBBtn color="success">
            <MDBIcon fas icon="plus-circle" className="me-2" />
            New Program
          </MDBBtn>
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
      </MDBTabs>

      <MDBTabsContent>
        {/* Overview Tab */}
        <MDBTabsPane show={activeTab === 'overview'}>
          {/* Stats Cards */}
          <MDBRow className="mb-4">
            <MDBCol md="4">
              <MDBCard className="h-100">
                <MDBCardBody className="text-center">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-3">
                      <MDBIcon fas icon="users" size="2x" className="text-primary" />
                    </div>
                  </div>
                  <MDBCardTitle tag="h2">{stats.totalClients}</MDBCardTitle>
                  <MDBCardText>Total Clients</MDBCardText>
                  <MDBBtn color="light" className="mt-2">View All Clients</MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="4">
              <MDBCard className="h-100">
                <MDBCardBody className="text-center">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-3">
                      <MDBIcon fas icon="clipboard-list" size="2x" className="text-success" />
                    </div>
                  </div>
                  <MDBCardTitle tag="h2">{stats.totalPrograms}</MDBCardTitle>
                  <MDBCardText>Health Programs</MDBCardText>
                  <MDBBtn color="light" className="mt-2">Manage Programs</MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="4">
              <MDBCard className="h-100">
                <MDBCardBody className="text-center">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <div className="rounded-circle bg-info bg-opacity-10 p-3">
                      <MDBIcon fas icon="file-medical" size="2x" className="text-info" />
                    </div>
                  </div>
                  <MDBCardTitle tag="h2">{stats.totalEnrollments}</MDBCardTitle>
                  <MDBCardText>Program Enrollments</MDBCardText>
                  <MDBBtn color="light" className="mt-2">View Enrollments</MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>

          {/* Recent Enrollments */}
          <MDBRow className="mb-4">
            <MDBCol>
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle className="mb-4">
                    <MDBIcon fas icon="calendar-check" className="me-2 text-primary" />
                    Recent Enrollments
                  </MDBCardTitle>
                  <MDBTable hover responsive>
                    <MDBTableHead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Client Name</th>
                        <th scope="col">Program</th>
                        <th scope="col">Date</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {recentEnrollments.map((enrollment, index) => (
                        <tr key={enrollment.id}>
                          <td>{index + 1}</td>
                          <td>{enrollment.clientName}</td>
                          <td>{enrollment.programName}</td>
                          <td>{new Date(enrollment.date).toLocaleDateString()}</td>
                          <td>
                            <MDBBtn color="link" size="sm" className="p-0 me-2">
                              <MDBIcon fas icon="eye" />
                            </MDBBtn>
                            <MDBBtn color="link" size="sm" className="p-0 text-success me-2">
                              <MDBIcon fas icon="edit" />
                            </MDBBtn>
                            <MDBBtn color="link" size="sm" className="p-0 text-danger">
                              <MDBIcon fas icon="trash" />
                            </MDBBtn>
                          </td>
                        </tr>
                      ))}
                    </MDBTableBody>
                  </MDBTable>
                  <div className="text-center mt-3">
                    <MDBBtn color="primary" outline>View All Enrollments</MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBTabsPane>

        {/* Programs Tab */}
        <MDBTabsPane show={activeTab === 'programs'}>
          <MDBRow className="mb-4">
            <MDBCol>
              <MDBCard>
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <MDBCardTitle className="mb-0">
                      <MDBIcon fas icon="clipboard-list" className="me-2 text-primary" />
                      Health Programs
                    </MDBCardTitle>
                    <MDBBtn color="success" size="sm">
                      <MDBIcon fas icon="plus" className="me-2" />
                      Add Program
                    </MDBBtn>
                  </div>
                  <MDBTable hover responsive>
                    <MDBTableHead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Program Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Enrolled Clients</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {programs.map((program, index) => (
                        <tr key={program.id}>
                          <td>{index + 1}</td>
                          <td>{program.name}</td>
                          <td>{program.description}</td>
                          <td>
                            <MDBBadge color="info" pill>
                              {program.enrolledClients}
                            </MDBBadge>
                          </td>
                          <td>
                            <MDBBtn color="link" size="sm" className="p-0 me-2">
                              <MDBIcon fas icon="eye" />
                            </MDBBtn>
                            <MDBBtn color="link" size="sm" className="p-0 text-success me-2">
                              <MDBIcon fas icon="edit" />
                            </MDBBtn>
                            <MDBBtn color="link" size="sm" className="p-0 text-danger">
                              <MDBIcon fas icon="trash" />
                            </MDBBtn>
                          </td>
                        </tr>
                      ))}
                    </MDBTableBody>
                  </MDBTable>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBTabsPane>

        {/* Clients Tab */}
        <MDBTabsPane show={activeTab === 'clients'}>
          <MDBRow className="mb-4">
            <MDBCol>
              <MDBCard>
                <MDBCardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <MDBCardTitle className="mb-0">
                      <MDBIcon fas icon="users" className="me-2 text-primary" />
                      Client Management
                    </MDBCardTitle>
                    <MDBBtn color="primary" size="sm">
                      <MDBIcon fas icon="user-plus" className="me-2" />
                      Add Client
                    </MDBBtn>
                  </div>
                  <MDBTable hover responsive>
                    <MDBTableHead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Gender</th>
                        <th scope="col">Date of Birth</th>
                        <th scope="col">Phone Number</th>
                        <th scope="col">Programs</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                      {clients.map((client, index) => (
                        <tr key={client.id}>
                          <td>{index + 1}</td>
                          <td>{client.name}</td>
                          <td>{client.gender}</td>
                          <td>{new Date(client.dob).toLocaleDateString()}</td>
                          <td>{client.phone}</td>
                          <td>
                            <MDBBadge color="info" pill>
                              {client.programs}
                            </MDBBadge>
                          </td>
                          <td>
                            <MDBBtn color="link" size="sm" className="p-0 me-2">
                              <MDBIcon fas icon="eye" />
                            </MDBBtn>
                            <MDBBtn color="link" size="sm" className="p-0 text-success me-2">
                              <MDBIcon fas icon="edit" />
                            </MDBBtn>
                            <MDBBtn color="link" size="sm" className="p-0 text-danger">
                              <MDBIcon fas icon="trash" />
                            </MDBBtn>
                          </td>
                        </tr>
                      ))}
                    </MDBTableBody>
                  </MDBTable>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default Dashboard;
