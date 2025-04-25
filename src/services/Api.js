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

export async function signinDoctor(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/doctors/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}