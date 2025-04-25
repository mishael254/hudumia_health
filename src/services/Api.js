import axios from 'axios';
const API_BASE_URL = 'http://localhost:3004';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }
  return response.json();
}

export async function signupDoctor(doctorData) {
  const response = await fetch(`${API_BASE_URL}/api/doctors/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(doctorData),
  });
  return handleResponse(response);
}

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