import axios from 'axios';
const API_BASE_URL = 'http://localhost:3004';

//Doctor sign-up
export const signupDoctor = async (doctorData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/doctors/signup`, doctorData);
    const data = response.data; // Get the entire response data

    if (response.status === 201) { // Changed to 201 (Created) for successful signup
      // Return the entire data object
      return data;
    } else {
      throw new Error(data.message || 'Signup failed');
    }
  } catch (error) {
     if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Signup failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
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
          twoFAQRCode: data.twoFAQRCode, // Include the QR code in the returned object
        };
      }
      return data; // Return the data (which may or may not include a token)
    } else {
      throw new Error(data.message || 'Login failed'); // Improved error message
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
  }
};