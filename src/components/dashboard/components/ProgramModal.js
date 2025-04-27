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

const ProgramModal = ({ show, setShow, program, onSubmit, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: ''
  });

  useEffect(() => {
    if (isEdit && program) {
      setFormData({
        name: program.name || '',
        description: program.description || '',
        duration: program.duration || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        duration: ''
      });
    }
  }, [program, isEdit, show]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('program', '').toLowerCase()]: value
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
              <MDBIcon fas icon="clipboard-list" className="me-2 text-success" />
              {isEdit ? 'Edit Health Program' : 'Create Health Program'}
            </MDBModalTitle>
            <MDBBtn className='btn-close' color='none' onClick={() => setShow(false)}></MDBBtn>
          </MDBModalHeader>
          <form onSubmit={handleSubmit}>
            <MDBModalBody>
              <div className="mb-3">
                <MDBInput 
                  label='Program Name' 
                  id='programName' 
                  type='text' 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <MDBTextArea 
                  label='Description' 
                  id='programDescription' 
                  rows={4} 
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <MDBInput 
                  label='Program Duration (months)' 
                  id='programDuration' 
                  type='number' 
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setShow(false)}>
                Cancel
              </MDBBtn>
              <MDBBtn color='success' type="submit">
                {isEdit ? 'Update Program' : 'Create Program'}
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default ProgramModal;
