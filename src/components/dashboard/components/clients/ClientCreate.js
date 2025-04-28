import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MenuItem,
  InputAdornment,
  Snackbar
} from '@mui/material';
import {
  Person,
  Cake,
  Transgender,
  Phone,
  CheckCircle,
  ArrowBack,
  Save
} from '@mui/icons-material';
import { createClient } from "../../../../services/Api";
import AltSidebar from '../../../sidebars/AltSidebar';
const ClientCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    sir_name: '',
    gender: '',
    date_of_birth: '',
    phone_number: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.sir_name.trim()) newErrors.sir_name = 'Sir name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    
    // Basic date validation (YYYY-MM-DD format)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (formData.date_of_birth && !dateRegex.test(formData.date_of_birth)) {
      newErrors.date_of_birth = 'Please use YYYY-MM-DD format';
    }
    
    // Phone number validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone_number.trim())) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await createClient(formData);
      
      setNotification({
        open: true,
        message: 'Client created successfully!',
        severity: 'success'
      });
      
      setFormData({
        first_name: '',
        second_name: '',
        sir_name: '',
        gender: '',
        date_of_birth: '',
        phone_number: ''
      });
      
      setTimeout(() => {
        navigate('/clients');
      }, 2000);
      
    } catch (error) {
      console.error("Error creating client:", error);
      setNotification({
        open: true,
        message: 'Failed to create client. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <div style={{ display: 'flex' }}>
        <AltSidebar/>
      <Box sx={{ flex: 1, p: 3 }}>
        <Card sx={{ 
          maxWidth: 1500, 
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
                  <Person fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    Register New Client
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Complete all required fields
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
                Back to Clients
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

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
                          label="First Name *"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          error={!!errors.first_name}
                          helperText={errors.first_name}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color={errors.first_name ? "error" : "action"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Second Name"
                          name="second_name"
                          value={formData.second_name}
                          onChange={handleChange}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Sir Name *"
                          name="sir_name"
                          value={formData.sir_name}
                          onChange={handleChange}
                          error={!!errors.sir_name}
                          helperText={errors.sir_name}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color={errors.sir_name ? "error" : "action"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          fullWidth
                          label="Gender *"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          error={!!errors.gender}
                          helperText={errors.gender}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Transgender color={errors.gender ? "error" : "action"} />
                              </InputAdornment>
                            ),
                          }}
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
                          label="Date of Birth *"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          error={!!errors.date_of_birth}
                          helperText={errors.date_of_birth}
                          placeholder="YYYY-MM-DD"
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Cake color={errors.date_of_birth ? "error" : "action"} />
                              </InputAdornment>
                            ),
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
                          label="Phone Number *"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          error={!!errors.phone_number}
                          helperText={errors.phone_number}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone color={errors.phone_number ? "error" : "action"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>

              <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ArrowBack />}
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
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                  disabled={isSubmitting}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600
                  }}
                >
                  {isSubmitting ? 'Registering...' : 'Register Client'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
          icon={notification.severity === 'success' ? <CheckCircle fontSize="inherit" /> : null}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ClientCreate;