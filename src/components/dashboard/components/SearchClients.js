import React, { useState } from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge
} from 'mdb-react-ui-kit';

const SearchClients = ({ clients, onSearch, onViewClient, onEnrollClient }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <MDBCard className="mb-4">
      <MDBCardBody>
        <MDBCardTitle className="mb-4">
          <MDBIcon fas icon="search" className="me-2 text-primary" />
          Search Clients
        </MDBCardTitle>
        <form className="search-form" onSubmit={handleSearch}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by name, ID, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MDBBtn type="submit" color="primary">Search</MDBBtn>
        </form>
        
        {/* Recent Clients */}
        <div className="mt-4">
          <h5 className="mb-3">Recent Clients</h5>
          <MDBTable hover responsive className="client-table">
            <MDBTableHead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Programs</th>
                <th scope="col">Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {clients.slice(0, 5).map((client) => (
                <tr key={client.id}>
                  <td>CL-{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>
                    <MDBBadge color="info" pill>
                      {client.programs}
                    </MDBBadge>
                  </td>
                  <td>
                    <div className="actions">
                      <MDBBtn color="link" size="sm" className="p-0 me-2" onClick={() => onViewClient(client)}>
                        <MDBIcon fas icon="eye" />
                      </MDBBtn>
                      <MDBBtn color="link" size="sm" className="p-0 text-info me-2" onClick={() => onEnrollClient(client)}>
                        <MDBIcon fas icon="plus" />
                      </MDBBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default SearchClients;
