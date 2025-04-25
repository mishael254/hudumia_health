import React from 'react';
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBContainer,
  MDBIcon,
  MDBBtn,
  MDBCollapse
} from 'mdb-react-ui-kit';

function HomeNavbar() {
  const [showNav, setShowNav] = React.useState(false);

  return (
    <MDBNavbar expand='lg' dark style={{ backgroundColor: 'hsl(218, 41%, 15%)' }}>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/' className='fw-bold'>
          <MDBIcon icon='hospital' className='me-2' />
          MediCare Portal
        </MDBNavbarBrand>

        <MDBNavbarToggler
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowNav(!showNav)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showNav}>
          <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
            <MDBNavbarItem>
              <MDBNavbarLink href='/' active>
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/about'>About</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/services'>Services</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='/contact'>Contact</MDBNavbarLink>
            </MDBNavbarItem>
          </MDBNavbarNav>

          <div className='d-flex align-items-center'>
            <MDBBtn
              href='/login'
              color='light'
              outline
              className='me-3 rounded-pill'
            >
              <MDBIcon icon='sign-in-alt' className='me-2' />
              Login
            </MDBBtn>
            <MDBBtn
              href='/signup'
              color='light'
              className='rounded-pill'
              style={{ backgroundColor: '#3b71ca' }}
            >
              <MDBIcon icon='user-plus' className='me-2' />
              Register
            </MDBBtn>
          </div>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default HomeNavbar;