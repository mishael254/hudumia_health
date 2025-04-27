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
  MDBInput,
  MDBTextArea
} from 'mdb-react-ui-kit';

const EnrollmentModal = ({ show, setShow, clients, programs, enrollment, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    programId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isEdit && enrollment) {
      setFormData({
        clientId: enrollment.clientId || '',
        programId: enrollment.programId || '',
        enrollmentDate: enrollment.enrollmentDate || new Date().toISOString().split('T')[0],
        notes: enrollment.notes || ''
      });
    } else {
      setFormData({
        clientId: '',
        programId: '',
        enrollmentDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  }, [enrollment, isEdit, show]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('enrollment', '').charAt(0).toLowerCase() + id.replace('enrollment', '').slice(1)]: value
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
              <MDBIcon fas icon="file-medical" className="me-2 text-info" />
              {isEdit ? 'Edit Enrollment' : 'Enroll Client in Program'}
            </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={() => setShow(false)}></MDBBtn>
          </MDBModalHeader>
          <form onSubmit={handleSubmit}>
            <MDBModalBody>
              <div className="mb-3">
                <label htmlFor="enrollmentClientId" className="form-label">Select Client</label>
                <select 
                  className="form-select" 
                  id="enrollmentClientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a client</option>
                  {clients && clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="enrollmentProgramId" className="form-label">Select Program</label>
                <select 
                  className="form-select" 
                  id="enrollmentProgramId"
                  value={formData.programId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a program</option>
                  {programs && programs.map(program => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <MDBInput 
                  label='Enrollment Date' 
                  id='enrollmentEnrollmentDate' 
                  type='date' 
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <MDBTextArea 
                  label='Notes' 
                  id='enrollmentNotes' 
                  rows={3} 
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setShow(false)}>
                Cancel
              </MDBBtn>
              <MDBBtn color='info' type="submit">
                {isEdit ? 'Update Enrollment' : 'Enroll Client'}
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default EnrollmentModal;
