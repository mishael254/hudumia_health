import React from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBContainer,
  MDBIcon,
} from "mdb-react-ui-kit";

function HomeNavbar() {
  return (
    <MDBNavbar
      expand="lg"
      dark
      style={{
        backgroundColor: "hsl(218, 41%, 15%)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <MDBContainer fluid>
        <MDBNavbarBrand href="/" className="fw-bold">
          <MDBIcon icon="hospital" className="me-2" />
          HudumiaHealth Portal
        </MDBNavbarBrand>
      </MDBContainer>
    </MDBNavbar>
  );
}

export default HomeNavbar;
