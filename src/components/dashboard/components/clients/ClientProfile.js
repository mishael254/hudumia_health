import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, Typography, Avatar, Box, CircularProgress ,Alert,
  AlertTitle, Divider, Button, Chip, Grid, Paper 
} from '@mui/material';
import { Email, Phone, LocationOn, CalendarToday } from '@mui/icons-material';
import { getClient } from '../../../../services/Api';
//import ClientTable from './ClientTable';
function ClientProfile () {
    const { clientId } = useParams(); // <-- Catch the client ID from URL
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading ] = useState(true);
  
    useEffect(() => {
        console.log('ClientProfile component rendered with id :', clientId);

        if(!clientId){
          setError('No client Id provided');
          setLoading(false);
          return;
        }


        const fetchClient = async () => {
          try {
            setLoading(true);
            const data = await getClient(clientId); // use getClient instead of axios.get
            console.log('Client data received: ',data);
            setClient(data);
          } catch (error) {
            console.error('Failed to fetch client:', error);
            setError(error.message || 'Failed to load client data');
          } finally {
            setLoading(false);
          }
        };
      
        fetchClient();
    }, [clientId]);

    if (loading) {
      return(

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
    );}
  
    return (
      <Card sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        my: 4,
        boxShadow: 3,
        borderRadius: '16px'
      }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <Avatar 
                src={client.avatar} 
                sx={{ width: 80, height: 80, mr: 3, fontSize: '2rem' }}
              >
                {client.firstName?.charAt(0)}{client.lastName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" component="div">
                  {client.firstName} {client.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Client ID: {client.id}
                </Typography>
                <Chip 
                  label={client.status || 'Active'} 
                  sx={{ mt: 1,
                    backgroundColor: client.status === 'Active' ? 'success.light' :
                                     client.status === 'Inactive' ? 'error.light' :
                                     'warning.light',
                    color: client.status === 'Active' ? 'success.dark' :
                           client.status === 'Inactive' ? 'error.dark' :
                           'warning.dark',
                  }} 
                />
              </Box>
            </Box>
  
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)} // <-- Go back to previous page
              sx={{ alignSelf: 'flex-start' }}
            >
              Back to List
            </Button>
          </Box>
  
          <Divider sx={{ my: 3 }} />
  
          <Grid container spacing={3}>
            {/* Contact Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Contact Information
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Email color="action" sx={{ mr: 2 }} />
                  <Typography>{client.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Phone color="action" sx={{ mr: 2 }} />
                  <Typography>{client.phone || 'Not provided'}</Typography>
                </Box>
                {client.address && (
                  <Box display="flex" alignItems="center">
                    <LocationOn color="action" sx={{ mr: 2 }} />
                    <Typography>{client.address}</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
  
            {/* Enrollment Details */}
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Enrollment Details
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday color="action" sx={{ mr: 2 }} />
                  <Typography>
                    Joined: {new Date(client.joinDate).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography paragraph>
                  Programs Enrolled: {client.enrollments?.length || 0}
                </Typography>
                {client.lastVisit && (
                  <Typography>
                    Last Visit: {new Date(client.lastVisit).toLocaleDateString()}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
  
          {client.notes && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Additional Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {client.notes}
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    );
  };
  
  export default ClientProfile;
  