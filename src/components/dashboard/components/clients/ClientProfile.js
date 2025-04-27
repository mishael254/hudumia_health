import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, Typography, Avatar, Box, Divider, Button, 
  Chip, Grid, Paper, CircularProgress, Alert, AlertTitle, 
  List, ListItem, ListItemText, ListItemIcon, Collapse,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { 
  Email, Phone, LocationOn, CalendarToday, Person, 
  Cake, Transgender, Update, HowToReg, Edit, Delete,
  Close, Check
} from '@mui/icons-material';
import { getClient, deleteClient } from '../../../../services/Api';
import AltSidebar from '../../../sidebars/AltSidebar';

function ClientProfile() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    console.log('ClientProfile component rendered with id:', clientId);

    if(!clientId) {
      setError('No client ID provided');
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        setLoading(true);
        const data = await getClient(clientId);
        console.log('Client data received:', data);
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

  const handleEdit = () => {
    navigate(`/edit-client/${clientId}`);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      await deleteClient(clientId);
      navigate('/clients', { state: { message: 'Client deleted successfully' } });
    } catch (error) {
      console.error('Failed to delete client:', error);
      setError(error.message || 'Failed to delete client');
    } finally {
      setDeleteLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div style={{ display: 'flex' }}>
      <AltSidebar/>
      <Box sx={{ flex: 1, p: 3 }}>
        {/* Clickable Card */}
        <Box 
          onClick={() => setShowActions(!showActions)}
          sx={{ cursor: 'pointer' }}
        >
          <Card sx={{ 
            maxWidth: 1000, 
            mx: 'auto', 
            boxShadow: 3,
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6
            }
          }}>
            <CardContent>
              {/* Header Section */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mr: 3, 
                      fontSize: '2.5rem',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  >
                    {client.first_name?.charAt(0)}{client.second_name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 600 }}>
                      {client.first_name} {client.second_name} {client.sir_name}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1} gap={2}>
                      <Chip 
                        label={`ID: ${client.id}`} 
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                      <Chip 
                        label={client.gender || 'Unknown'} 
                        size="small"
                        icon={<Transgender fontSize="small" />}
                        sx={{ fontWeight: 500 }}
                      />
                      {client.date_of_birth && (
                        <Chip 
                          label={`Age: ${calculateAge(client.date_of_birth)}`} 
                          size="small"
                          icon={<Cake fontSize="small" />}
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                <Button 
                  variant="outlined" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(-1);
                  }}
                  startIcon={<HowToReg />}
                  sx={{ 
                    alignSelf: 'flex-start',
                    borderRadius: '12px',
                    px: 3,
                    py: 1
                  }}
                >
                  Back to Clients
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Main Content Grid */}
              <Grid container spacing={3}>
                {/* Personal Information Column */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                    <Typography variant="h5" gutterBottom sx={{ 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Person color="primary" /> Personal Information
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon><Cake color="action" /></ListItemIcon>
                        <ListItemText 
                          primary="Date of Birth" 
                          secondary={client.date_of_birth ? formatDate(client.date_of_birth) : 'Not provided'} 
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon><Transgender color="action" /></ListItemIcon>
                        <ListItemText 
                          primary="Gender" 
                          secondary={client.gender || 'Not provided'} 
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon><Phone color="action" /></ListItemIcon>
                        <ListItemText 
                          primary="Phone Number" 
                          secondary={client.phone_number || 'Not provided'} 
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>

                {/* Registration Details Column */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                    <Typography variant="h5" gutterBottom sx={{ 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <HowToReg color="primary" /> Registration Details
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CalendarToday color="action" /></ListItemIcon>
                        <ListItemText 
                          primary="Registration Date" 
                          secondary={formatDate(client.registration_date)} 
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon><Update color="action" /></ListItemIcon>
                        <ListItemText 
                          primary="Last Updated" 
                          secondary={formatDate(client.updated_at)} 
                        />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>

              {/* Additional Notes Section */}
              {client.notes && (
                <>
                  <Divider sx={{ my: 4 }} />
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                      Additional Notes
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                      <Typography variant="body1">
                        {client.notes}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Action Buttons - Collapsible */}
        <Collapse in={showActions} timeout="auto" unmountOnExit>
          <Box 
            display="flex" 
            justifyContent="center" 
            gap={3} 
            mt={3}
            sx={{
              maxWidth: 1000,
              mx: 'auto'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Edit Client
            </Button>
            
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeleteClick}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Delete Client
            </Button>
          </Box>
        </Collapse>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Delete"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete {client.first_name} {client.second_name}'s profile? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleDeleteCancel} 
              startIcon={<Close />}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error"
              startIcon={<Check />}
              disabled={deleteLoading}
              autoFocus
            >
              {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}

export default ClientProfile;