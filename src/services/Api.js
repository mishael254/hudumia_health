import axios from 'axios';
const API_BASE_URL = 'http://localhost:3004/api';

//Doctor sign-up
export const signupDoctor = async (doctorData) => {
  try {
    console.log('signupDoctor called with data:', doctorData);
    const response = await axios.post(`${API_BASE_URL}/doctors/signup`, doctorData);
    const data = response.data;

    if (response.status === 201) {
      return data;
    } else {
      console.error('signupDoctor error:', data);
      throw new Error(data.message || 'Signup failed');
    }
  } catch (error) {
    console.error('signupDoctor catch error:', error);
    if (error.response) {
      console.error('signupDoctor error.response:', error.response);
      // IMPORTANT:  Use the server's message if available
      throw new Error(error.response.data.error || 'Signup failed'); 
    } else if (error.request) {
      console.error('signupDoctor error.request', error.request);
      throw new Error('No response from server');
    } else {
      console.error('signupDoctor other error:', error);
      throw new Error(error.message);
    }
  }
};

//  Doctor sign-in
export const signinDoctor = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/doctors/signin`, credentials);
    const data = response.data;

    if (response.status === 200) {
      if (data.twoFAQRCode) {
        return {
          ...data,
          twoFAQRCode: data.twoFAQRCode,
        };
      }
      return data;
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};
