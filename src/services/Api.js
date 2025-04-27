import axios from 'axios';
const API_BASE_URL = 'http://localhost:3004/api';

// Create axios instance with auth header
const createAuthenticatedAxios = () => {
  const token = localStorage.getItem('hudumia_health_token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

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
      if (data.token) {
        return {
          ...data,
          token: data.token,
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

// Dashboard API functions

// Get all health programs
export const getPrograms = async () => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.get('/programs');
    return response.data;
  } catch (error) {
    console.error('Error fetching programs:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch programs');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Create a new health program
export const createProgram = async (programData) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.post('/programs', programData);
    return response.data;
  } catch (error) {
    console.error('Error creating program:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to create program');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Update a health program
export const updateProgram = async (programId, programData) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.put(`/programs/${programId}`, programData);
    return response.data;
  } catch (error) {
    console.error('Error updating program:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to update program');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Delete a health program
export const deleteProgram = async (programId) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.delete(`/programs/${programId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting program:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to delete program');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Get all clients
export const getClients = async () => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.get('/clients');
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch clients');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Create a new client
export const createClient = async (clientData) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.post('/clients', clientData);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to create client');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Update a client
export const updateClient = async (clientId, clientData) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.put(`/clients/${clientId}`, clientData);
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to update client');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Delete a client
export const deleteClient = async (clientId) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.delete(`/clients/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting client:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to delete client');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Search for clients
export const searchClients = async (searchParams) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.get('/clients/search', { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Error searching clients:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to search clients');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Enroll a client in a program
export const enrollClientInProgram = async (enrollmentData) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.post('/enrollments', enrollmentData);
    return response.data;
  } catch (error) {
    console.error('Error enrolling client:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to enroll client');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Get all programs a client is enrolled in
export const getClientEnrollments = async (clientId) => {
  try {
    const authAxios = createAuthenticatedAxios();
    const response = await authAxios.get(`/clients/${clientId}/enrollments`);
    
    // Format the data to match the expected structure in the dashboard
    const formattedData = response.data.map(enrollment => ({
      id: enrollment.program_id,
      programName: enrollment.program_name,
      date: enrollment.enrollment_date,
      status: 'Active'
    }));
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching client enrollments:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch client enrollments');
    } else if (error.request) {
      throw new Error('No response from server');
    } else {
      throw new Error(error.message);
    }
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    // This is a custom function that aggregates data from multiple endpoints
    const [clients, programs] = await Promise.all([
      getClients(),
      getPrograms()
    ]);
    
    // Calculate statistics
    const totalClients = clients.length;
    const totalPrograms = programs.length;
    
    // For enrollments, we would need to fetch all enrollments or calculate from client data
    // For now, we'll estimate based on available data
    const totalEnrollments = clients.reduce((sum, client) => sum + (client.programs || 0), 0);
    
    return {
      totalClients,
      totalPrograms,
      totalEnrollments
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
};

// Get recent enrollments
export const getRecentEnrollments = async (limit = 5) => {
  try {
    // This would ideally be a dedicated endpoint, but we'll simulate it
    // by fetching clients and programs and joining the data
    const [clients, programs] = await Promise.all([
      getClients(),
      getPrograms()
    ]);
    
    // Create mock recent enrollments based on available data
    // In a real implementation, you would have a specific API endpoint for this
    const recentEnrollments = clients.slice(0, limit).map((client, index) => {
      const program = programs[index % programs.length];
      return {
        id: index + 1,
        clientName: `${client.first_name} ${client.second_name}`,
        programName: program ? program.name : 'Unknown Program',
        date: new Date(Date.now() - (index * 86400000)).toISOString().split('T')[0] // Recent dates
      };
    });
    
    return recentEnrollments;
  } catch (error) {
    console.error('Error fetching recent enrollments:', error);
    throw new Error('Failed to fetch recent enrollments');
  }
};
