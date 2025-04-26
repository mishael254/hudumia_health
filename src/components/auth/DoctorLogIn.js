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
  MDBTypography,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import { signinDoctor } from '../../services/Api'; // Ensure this function handles the QR code
import { useNavigate } from 'react-router-dom';

function DoctorLogIn() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // Added success message
  const navigate = useNavigate();

    const resetForm = () => {
        setIdentifier('');
        setPassword('');
        setToken('');
        setRememberMe(false);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage(''); // Clear message

    try {
      const credentials = {
        identifier,
        password,
        token,
        rememberMe
      };
      const data = await signinDoctor(credentials);
      console.log('Login successful:', data);
      // Handle successful login (redirect, store token, etc.)
      if (data.token) {
        localStorage.setItem('token', data.token);
        setSuccessMessage('Login successful!'); // Set success message
        //  setIsAuthenticated(true);  //移到App.js
        //  navigate('/dashboard');  //移到App.js // Remove immediate navigation

        setTimeout(() => {
          //  setIsAuthenticated(true);
          navigate('/dashboard'); // Redirect after 2 seconds
        }, 2000);
      } else if (data.twoFAQRCode) {
        setErrorMessage("Please enter the 2FA token sent to your email");
        setIsSubmitting(false);
        resetForm();
        return;
      } else {
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
        resetForm();
        return;
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Invalid credentials. Please try again.');
      setIsSubmitting(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MDBContainer fluid className="p-4 background-radial-gradient overflow-hidden" style={{ minHeight: '100vh' }}>
      <MDBRow className="justify-content-center align-items-center">
        <MDBCol md="10" lg="8" xl="6">
          <MDBCard className="my-5" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <MDBRow className="g-0">
              <MDBCol md="6" className="d-flex align-items-center">
                <MDBCardImage
                  src="https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                  alt="Doctor login"
                  fluid
                  style={{ borderTopLeftRadius: '15px', borderBottomLeftRadius: '15px', height: '100%', objectFit: 'cover' }}
                />
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="p-5">
                  <div className="text-center mb-4">
                    <MDBTypography tag="h4" className="fw-bold mb-3" style={{ color: '#3b71ca' }}>
                      Welcome Back, Doctor
                    </MDBTypography>
                    <p className="text-muted mb-4">Please enter your credentials</p>
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
                    <div className="mb-4">
                      <MDBInput
                        label="Email or Username"
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-4">
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
                        label="2FA Token"
                        id="token"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        className="rounded-5"
                      />
                    </div>

                    <div className="mb-4 d-flex justify-content-between">
                      <MDBCheckbox
                        name="rememberMe"
                        id="rememberMe"
                        label="Remember me"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <a href="#!" style={{ color: '#3b71ca' }}>Forgot password?</a>
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
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </MDBBtn>

                    <div className="text-center">
                      <p className="mb-0">
                        Don't have an account? <a href="/signup" style={{ color: '#3b71ca' }}>Sign up</a>
                      </p>
                    </div>
                  </form>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>

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

export default DoctorLogIn;
