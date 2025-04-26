import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon,
  MDBNavbarNav,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBBadge
} from 'mdb-react-ui-kit';

function DashboardNavbar() {
  const [showNavCentred, setShowNavCentred] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <MDBNavbar expand='lg' dark style={{ backgroundColor: 'hsl(218, 41%, 15%)' }}>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/dashboard'>
          <MDBIcon icon='hospital' className='me-2' />
          HudumiaHealth Portal
        </MDBNavbarBrand>

        <MDBNavbarToggler
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowNavCentred(!showNavCentred)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showNavCentred}>
          <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='/dashboard'>
                <MDBIcon fas icon='tachometer-alt' className='me-2' />
                Dashboard
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>
                <MDBIcon fas icon='users' className='me-2' />
                Clients
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>
                <MDBIcon fas icon='clipboard-list' className='me-2' />
                Programs
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>
                <MDBIcon fas icon='calendar-alt' className='me-2' />
                Appointments
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>
                <MDBIcon fas icon='chart-bar' className='me-2' />
                Reports
              </MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>

          <div className='d-flex align-items-center'>
            <MDBDropdown group className='me-3'>
              <MDBDropdownToggle color='link' style={{ color: 'white', textDecoration: 'none' }}>
                <MDBIcon fas icon='bell' size='lg' />
                <MDBBadge color='danger' dot notification pill />
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem header>Notifications</MDBDropdownItem>
                <MDBDropdownItem>
                  <div className='d-flex align-items-center'>
                    <MDBIcon fas icon='user-plus' className='me-2 text-success' />
                    <div>
                      <div className='fw-bold'>New client registered</div>
                      <div className='text-muted small'>10 minutes ago</div>
                    </div>
                  </div>
                </MDBDropdownItem>
                <MDBDropdownItem>
                  <div className='d-flex align-items-center'>
                    <MDBIcon fas icon='calendar-check' className='me-2 text-primary' />
                    <div>
                      <div className='fw-bold'>Program enrollment</div>
                      <div className='text-muted small'>1 hour ago</div>
                    </div>
                  </div>
                </MDBDropdownItem>
                <MDBDropdownItem>
                  <div className='d-flex align-items-center'>
                    <MDBIcon fas icon='exclamation-circle' className='me-2 text-warning' />
                    <div>
                      <div className='fw-bold'>System update</div>
                      <div className='text-muted small'>Yesterday</div>
                    </div>
                  </div>
                </MDBDropdownItem>
                <MDBDropdownItem divider />
                <MDBDropdownItem link>View all notifications</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>

            <MDBDropdown group>
              <MDBDropdownToggle color='link' style={{ color: 'white', textDecoration: 'none' }}>
                <div className='d-flex align-items-center'>
                  <div className='rounded-circle bg-light d-flex justify-content-center align-items-center me-2' style={{ width: '32px', height: '32px' }}>
                    <MDBIcon fas icon='user-md' className='text-primary' />
                  </div>
                  <span>Dr. Account</span>
                </div>
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link href='#'>
                  <MDBIcon fas icon='user-circle' className='me-2' /> My Profile
                </MDBDropdownItem>
                <MDBDropdownItem link href='#'>
                  <MDBIcon fas icon='cog' className='me-2' /> Settings
                </MDBDropdownItem>
                <MDBDropdownItem divider />
                <MDBDropdownItem link onClick={handleLogout}>
                  <MDBIcon fas icon='sign-out-alt' className='me-2' /> Logout
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default DashboardNavbar;
