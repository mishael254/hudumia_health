import React, { useState, useEffect } from 'react';
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
  MDBInput
} from 'mdb-react-ui-kit';

const ClientModal = ({ show, setShow, client, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    sir_name: '',
    gender: '',
    date_of_birth: '',
    phone_number: '',
    address: '',
    email: ''
  });

  useEffect(() => {
    if (isEdit && client) {
      setFormData({
        first_name: client.first_name || '',
        second_name: client.second_name || '',
        sir_name: client.sir_name || '',
        gender: client.gender || '',
        date_of_birth: client.date_of_birth || '',
        phone_number: client.phone_number || '',
        address: client.address || '',
        email: client.email || ''
      });
    } else {
      setFormData({
        first_name: '',
        second_name: '',
        sir_name: '',
        gender: '',
        date_of_birth: '',
        phone_number: '',
        address: '',
        email: ''
      });
    }
  }, [client, isEdit, show]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('client', '').toLowerCase()]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <MDBModal show={show} setShow={setShow} tabIndex='-1'>
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>
              <MDBIcon fas icon="user-plus" className="me-2 text-primary" />
              {isEdit ? 'Edit Client' : 'Register New Client'}
            </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={() => setShow(false)}></MDBBtn>
          </MDBModalHeader>
          <form onSubmit={handleSubmit}>
            <MDBModalBody>
              <div className="mb-3">
                <MDBInput 
                  label='First Name' 
                  id='clientFirstName' 
                  type='text' 
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <MDBInput 
                  label='Second Name' 
                  id='clientSecondName' 
                  type='text' 
                  value={formData.second_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <MDBInput 
                  label='Sir Name' 
                  id='clientSirName' 
                  type='text' 
                  value={formData.sir_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <select 
                  className="form-select" 
                  id="clientGender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <MDBInput 
                  label='Date of Birth' 
                  id='clientDateOfBirth' 
                  type='date' 
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <MDBInput 
                  label='Phone Number' 
                  id='clientPhoneNumber' 
                  type='tel' 
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <MDBInput 
                  label='Address' 
                  id='clientAddress' 
                  type='text' 
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <MDBInput 
                  label='Email (Optional)' 
                  id='clientEmail' 
                  type='email' 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setShow(false)}>
                Cancel
              </MDBBtn>
              <MDBBtn color='primary' type="submit">
                {isEdit ? 'Update Client' : 'Register Client'}
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default ClientModal;
