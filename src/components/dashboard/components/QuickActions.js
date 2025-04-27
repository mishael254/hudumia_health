import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBIcon
} from 'mdb-react-ui-kit';

const QuickActions = ({ onRegisterClient, onCreateProgram, onEnrollClient, onViewAPI }) => {
  return (
    <MDBCard>
      <MDBCardBody>
        <h4 className="mb-4">Quick Actions</h4>
        <div className="action-buttons">
          <a href="#" className="action-btn" onClick={(e) => { e.preventDefault(); onRegisterClient(); }}>
            <div className="action-icon register">
              <MDBIcon fas icon="user-plus" />
            </div>
            <span>Register New Client</span>
          </a>
          
          <a href="#" className="action-btn" onClick={(e) => { e.preventDefault(); onCreateProgram(); }}>
            <div className="action-icon program">
              <MDBIcon fas icon="clipboard-list" />
            </div>
            <span>Create Health Program</span>
          </a>
          
          <a href="#" className="action-btn" onClick={(e) => { e.preventDefault(); onEnrollClient(); }}>
            <div className="action-icon enroll">
              <MDBIcon fas icon="file-medical" />
            </div>
            <span>Enroll Client in Program</span>
          </a>
          
          <a href="#" className="action-btn" onClick={(e) => { e.preventDefault(); onViewAPI(); }}>
            <div className="action-icon view">
              <MDBIcon fas icon="plug" />
            </div>
            <span>API Documentation</span>
          </a>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default QuickActions;
