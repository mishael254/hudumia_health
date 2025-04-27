import React from 'react';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from 'mdb-react-ui-kit';

const ViewClientModal = ({ show, setShow, client, enrollments }) => {
  if (!client) return null;

  return (
    <MDBModal show={show} setShow={setShow} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>
              <MDBIcon fas icon="user" className="me-2 text-primary" />
              Client Profile
            </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={() => setShow(false)}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <div className="client-profile">
              <div className="form-group">
                <label className="form-label">Client ID</label>
                <div className="form-input">CL-{client.id}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input">{client.name}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="form-input">{client.gender}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <div className="form-input">{new Date(client.dob).toLocaleDateString()}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="form-input">{client.phone}</div>
              </div>
              {client.address && (
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <div className="form-input">{client.address}</div>
                </div>
              )}
              {client.email && (
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <div className="form-input">{client.email}</div>
                </div>
              )}
              
              <h5 className="mt-4 mb-3">Enrolled Programs</h5>
              {enrollments && enrollments.length > 0 ? (
                <MDBTable hover responsive>
                  <MDBTableHead>
                    <tr>
                      <th>Program</th>
                      <th>Enrollment Date</th>
                      <th>Status</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>{enrollment.programName}</td>
                        <td>{new Date(enrollment.date).toLocaleDateString()}</td>
                        <td>Active</td>
                      </tr>
                    ))}
                  </MDBTableBody>
                </MDBTable>
              ) : (
                <p>No program enrollments found for this client.</p>
              )}
            </div>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color='primary' onClick={() => setShow(false)}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default ViewClientModal;
