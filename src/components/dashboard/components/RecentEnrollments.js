import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from 'mdb-react-ui-kit';

const RecentEnrollments = ({ enrollments, onViewEnrollment, onEditEnrollment, onDeleteEnrollment }) => {
  return (
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
            {enrollments.map((enrollment, index) => (
              <tr key={enrollment.id}>
                <td>{index + 1}</td>
                <td>{enrollment.clientName}</td>
                <td>{enrollment.programName}</td>
                <td>{new Date(enrollment.date).toLocaleDateString()}</td>
                <td>
                  <MDBBtn color="link" size="sm" className="p-0 me-2" onClick={() => onViewEnrollment(enrollment)}>
                    <MDBIcon fas icon="eye" />
                  </MDBBtn>
                  <MDBBtn color="link" size="sm" className="p-0 text-success me-2" onClick={() => onEditEnrollment(enrollment)}>
                    <MDBIcon fas icon="edit" />
                  </MDBBtn>
                  <MDBBtn color="link" size="sm" className="p-0 text-danger" onClick={() => onDeleteEnrollment(enrollment)}>
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
  );
};

export default RecentEnrollments;
