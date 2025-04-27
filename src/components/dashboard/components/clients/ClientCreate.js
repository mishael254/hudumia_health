import React, { useState } from "react";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography,
  TextField,
  useTheme,
  Grid,
  MenuItem,
  InputAdornment,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Person as PersonIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Transgender as TransgenderIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import { createClient } from "../../../../services/Api";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function ClientCreate() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    sir_name: '',
    gender: '',
    date_of_birth: null,
    phone_number: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const genders = [
    { value: 'Male', label: 'Male', icon: <MaleIcon /> },
    { value: 'Female', label: 'Female', icon: <FemaleIcon /> },
    { value: 'Other', label: 'Other', icon: <TransgenderIcon /> },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.sir_name.trim()) newErrors.sir_name = 'Sir name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    
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

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date_of_birth: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await createClient({
        ...formData,
        date_of_birth: format(formData.date_of_birth, 'yyyy-MM-dd')
      });
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Client created successfully!',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        first_name: '',
        second_name: '',
        sir_name: '',
        gender: '',
        date_of_birth: null,
        phone_number: ''
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/client-dashboard');
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card sx={{ 
        borderRadius: '16px',
        boxShadow: theme.shadows[4],
        mt: 2,
        background: theme.palette.background.paper
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main,
              mr: 2,
              width: 56,
              height: 56
            }}>
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ 
              fontWeight: '600',
              color: theme.palette.text.primary
            }}>
              New Client Registration
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* First Name */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="First Name *"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                  variant="outlined"
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color={errors.first_name ? "error" : "action"} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Second Name */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Second Name"
                  name="second_name"
                  value={formData.second_name}
                  onChange={handleChange}
                  variant="outlined"
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Sir Name */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Sir Name *"
                  name="sir_name"
                  value={formData.sir_name}
                  onChange={handleChange}
                  error={!!errors.sir_name}
                  helperText={errors.sir_name}
                  variant="outlined"
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color={errors.sir_name ? "error" : "action"} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Gender */}
              <Grid item xs={12} md={6}>
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
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {formData.gender ? 
                          genders.find(g => g.value === formData.gender)?.icon :
                          <TransgenderIcon color={errors.gender ? "error" : "action"} />
                        }
                      </InputAdornment>
                    ),
                  }}
                >
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box display="flex" alignItems="center">
                        <Box mr={1}>{option.icon}</Box>
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* Date of Birth */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date of Birth *"
                  value={formData.date_of_birth}
                  onChange={handleDateChange}
                  maxDate={new Date()}
                  disabled={isSubmitting}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.date_of_birth}
                      helperText={errors.date_of_birth}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeIcon color={errors.date_of_birth ? "error" : "action"} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              
              {/* Phone Number */}
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
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color={errors.phone_number ? "error" : "action"} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Submit Button */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                    sx={{
                      px: 6,
                      py: 1.5,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      textTransform: 'none',
                      boxShadow: theme.shadows[2],
                      '&:hover': {
                        boxShadow: theme.shadows[4]
                      },
                      '&.Mui-disabled': {
                        backgroundColor: theme.palette.primary.light
                      }
                    }}
                  >
                    {isSubmitting ? 'Registering...' : 'Register Client'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {/* Success/Error Notification */}
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
          icon={notification.severity === 'success' ? <CheckCircleIcon fontSize="inherit" /> : null}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}

export default ClientCreate;