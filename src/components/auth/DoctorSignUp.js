import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBCheckbox,
  MDBTypography
} from 'mdb-react-ui-kit';
import { signupDoctor } from '../../services/Api';
import { useNavigate } from 'react-router-dom';

function DoctorSignUp() {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [twoFAQRCode, setTwoFAQRCode] = useState(null);
  const [showQRCodeOverlay, setShowQRCodeOverlay] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setFirstName('');
    setSecondName('');
    setUserName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('Loading...'); // Set initial loading message
    setTwoFAQRCode(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsSubmitting(false);
      setSuccessMessage(''); // Clear loading message
      return;
    }

    const doctorData = {
      firstName,
      secondName,
      userName,
      email,
      phoneNumber,
      password,
    };

    try {
      const data = await signupDoctor(doctorData);
      console.log('Signup successful:', data);
      setSuccessMessage('Registration successful! Redirecting...'); // Update success message

      if (data.twoFAQRCode) {
        setTwoFAQRCode(data.twoFAQRCode);
        setShowQRCodeOverlay(true);
      } else {
        // Delay navigation to login
        setTimeout(() => {
          resetForm();
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.message || 'Signup failed. Please try again.');
      resetForm();
      setIsSubmitting(false);
      setSuccessMessage(''); // Clear loading message
    } finally {
      setIsSubmitting(false); // Keep isSubmitting false here to allow message to display
    }
  };

  const handleNext = () => {
    setShowQRCodeOverlay(false);
    resetForm();
    navigate('/login');
  };

  return (
    <MDBContainer fluid className="p-4 background-radial-gradient overflow-hidden" style={{ minHeight: '100vh' }}>
      <MDBRow className="justify-content-center align-items-center">
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard className="my-5" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <MDBRow className="g-0">
              <MDBCol md="6" className="d-flex align-items-center">
                <MDBCardImage
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Doctor signup"
                  fluid
                  style={{ borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px', height: '100%', objectFit: 'cover' }}
                />
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="p-5">
                  <div className="text-center mb-4">
                    <MDBTypography tag="h4" className="fw-bold mb-3" style={{ color: '#3b71ca' }}>
                      Doctor Registration
                    </MDBTypography>
                    <p className="text-muted mb-4">Join our medical community today</p>
                  </div>

                  {errorMessage && (
                    <div className="alert alert-danger mb-4" role="alert">
                      {errorMessage}
                    </div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success mb-4" role="alert">
                      {successMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <MDBInput
                        label="First Name"
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-3">
                      <MDBInput
                        label="Last Name"
                        id="secondName"
                        type="text"
                        value={secondName}
                        onChange={(e) => setSecondName(e.target.value)}
                        required
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-3">
                      <MDBInput
                        label="Username"
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-3">
                      <MDBInput
                        label="Email"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-3">
                      <MDBInput
                        label="Phone Number"
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-3">
                      <MDBInput
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-4">
                      <MDBInput
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-4 d-flex justify-content-between">
                      <MDBCheckbox
                        name="flexCheck"
                        id="flexCheckDefault"
                        label="I agree to the terms and conditions"
                        required
                      />
                    </div>

                    <MDBBtn
                      type="submit"
                      className="w-100 mb-3 rounded-5"
                      size="lg"
                      disabled={isSubmitting}
                      style={{ backgroundColor: '#3b71ca' }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </>
                      ) : (
                        'Register'
                      )}
                    </MDBBtn>

                    <div className="text-center">
                      <p className="mb-0">
                        Already have an account? <a href="/login" style={{ color: '#3b71ca' }}>Login</a>
                      </p>
                    </div>
                  </form>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* QR Code Display */}
      {showQRCodeOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#fff',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <h2>Two-Factor Authentication Setup</h2>
          <p style={{ maxWidth: '500px', marginBottom: '20px' }}>
            Please scan the QR code below using Google Authenticator or any TOTP app. If you
            don't have one, install Google Authenticator from the app store.
          </p>
          <img src={twoFAQRCode} alt="2FA QR Code" style={{ width: '200px', height: '200px', marginBottom: '20px' }} />
          <MDBBtn onClick={handleNext} color="light" className="rounded-5">
            Next
          </MDBBtn>
        </div>
      )}

      <style>
        {`
          .background-radial-gradient {
            background-color: hsl(218, 41%, 15%);
            background-image: radial-gradient(
              650px circle at 0% 0%,
              hsl(218, 41%, 35%) 15%,
              hsl(218, 41%, 30%) 35%,
              hsl(218, 41%, 20%) 75%,
              hsl(218, 41%, 19%) 80%,
              transparent 100%
            ),
            radial-gradient(
              1250px circle at 100% 100%,
              hsl(218, 41%, 45%) 15%,
              hsl(218, 41%, 30%) 35%,
              hsl(218, 41%, 20%) 75%,
              hsl(218, 41%, 19%) 80%,
              transparent 100%
            );
          }
        `}
      </style>
    </MDBContainer>
  );
}

export default DoctorSignUp;
