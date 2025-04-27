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
  MDBIcon
} from 'mdb-react-ui-kit';

const APIDocModal = ({ show, setShow }) => {
  return (
    <MDBModal show={show} setShow={setShow} tabIndex='-1'>
      <MDBModalDialog size="lg">
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>
              <MDBIcon fas icon="plug" className="me-2 text-dark" />
              API Documentation
            </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={() => setShow(false)}></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <h3>Client Profile API</h3>
            <div className="api-endpoint">
              <span className="api-method">GET</span>
              <span className="api-url">/api/clients/{'{clientId}'}</span>
            </div>
            
            <div className="api-code">
              <pre>
{`// Sample Response
{
  "id": "CL-0035",
  "name": "Jane Cooper",
  "gender": "Female",
  "dateOfBirth": "1985-04-15",
  "phoneNumber": "+254 712 345 678",
  "address": "123 Main St, Nairobi",
  "email": "jane.cooper@example.com",
  "programs": [
    {
      "id": 1,
      "name": "TB",
      "enrollmentDate": "2025-01-12",
      "status": "Active"
    },
    {
      "id": 2,
      "name": "Malaria",
      "enrollmentDate": "2025-03-03",
      "status": "Active"
    }
  ],
  "createdAt": "2025-01-05T12:30:45Z",
  "updatedAt": "2025-03-10T09:15:22Z"
}`}
              </pre>
            </div>
            
            <h3 className="mt-4">Authentication</h3>
            <p>All API requests require an API key to be passed in the Authorization header:</p>
            <div className="api-code">
              <pre>
{`Authorization: Bearer YOUR_API_KEY`}
              </pre>
            </div>
            
            <h3 className="mt-4">Available Endpoints</h3>
            
            <h5 className="mt-3">Clients</h5>
            <ul>
              <li><code>GET /api/clients</code> - Get all clients</li>
              <li><code>GET /api/clients/{'{clientId}'}</code> - Get a specific client</li>
              <li><code>POST /api/clients</code> - Create a new client</li>
              <li><code>PUT /api/clients/{'{clientId}'}</code> - Update a client</li>
              <li><code>DELETE /api/clients/{'{clientId}'}</code> - Delete a client</li>
              <li><code>GET /api/clients/search</code> - Search for clients</li>
            </ul>
            
            <h5 className="mt-3">Programs</h5>
            <ul>
              <li><code>GET /api/programs</code> - Get all programs</li>
              <li><code>GET /api/programs/{'{programId}'}</code> - Get a specific program</li>
              <li><code>POST /api/programs</code> - Create a new program</li>
              <li><code>PUT /api/programs/{'{programId}'}</code> - Update a program</li>
              <li><code>DELETE /api/programs/{'{programId}'}</code> - Delete a program</li>
            </ul>
            
            <h5 className="mt-3">Enrollments</h5>
            <ul>
              <li><code>POST /api/enrollments</code> - Enroll a client in a program</li>
              <li><code>GET /api/clients/{'{clientId}'}/enrollments</code> - Get all programs a client is enrolled in</li>
              <li><code>GET /api/programs/{'{programId}'}/clients</code> - Get all clients enrolled in a program</li>
            </ul>
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

export default APIDocModal;
