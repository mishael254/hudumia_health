import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
  Divider,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Person,
  Cake,
  Transgender,
  Phone,
  Email,
  LocationOn,
  ArrowBack,
  Save,
  Cancel
} from '@mui/icons-material';
import { getClient, updateClient } from '../../../../services/Api';
import AltSidebar from '../../../sidebars/AltSidebar';

const EditClient = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const data = await getClient(clientId);
        setClient(data);
        setFormData({
          first_name: data.first_name || '',
          second_name: data.second_name || '',
          sir_name: data.sir_name || '',
          gender: data.gender || '',
          date_of_birth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
          phone_number: data.phone_number || '',
          email: data.email || '',
          address: data.address || '',
          notes: data.notes || ''
        });
      } catch (error) {
        console.error('Error fetching client:', error);
        setError(error.message || 'Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateClient(clientId, formData);
      setSuccess('Client updated successfully!');
      setTimeout(() => {
        navigate(`/clients-profile/${clientId}`); // Fixed route
      }, 1500);
    } catch (error) {
      console.error('Error updating client:', error);
      setError(error.message || 'Failed to update client');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/clients-profile/${clientId}`); // Fixed route
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (!client) {
    return (
      <Typography variant="body1" sx={{ p: 4 }}>
        Client not found
      </Typography>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <AltSidebar />
      <Box sx={{ flex: 1, p: 3 }}>
        <Card sx={{ 
          maxWidth: 1000, 
          mx: 'auto', 
          boxShadow: 3,
          borderRadius: '16px'
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center">
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 3, 
                    fontSize: '2rem',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  {client.first_name?.charAt(0)}{client.second_name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    Edit Client Profile
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    ID: {client.id}
                  </Typography>
                </Box>
              </Box>

              <Button 
                variant="outlined" 
                onClick={handleCancel}
                startIcon={<ArrowBack />}
                sx={{ 
                  borderRadius: '12px',
                  px: 3,
                  py: 1
                }}
              >
                Back to Profile
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                      Personal Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Second Name"
                          name="second_name"
                          value={formData.second_name}
                          onChange={handleChange}
                          required
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Sir Name"
                          name="sir_name"
                          value={formData.sir_name}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          variant="outlined"
                        >
                          {genderOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          name="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                      Contact Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          variant="outlined"
                          multiline
                          rows={2}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOn color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>

              <Box mt={3}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                    Additional Notes
                  </Typography>
                  <TextField
                    fullWidth
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Paper>
              </Box>

              <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  disabled={saving}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default EditClient;