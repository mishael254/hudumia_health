import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getClients } from '../../../../services/Api';


const ClientTable = () => {
  
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleViewClient = (clientId) => {
    console.log('Navigating to client profile with ID:', clientId);
    navigate(`/clients-profile/${clientId}`);
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
      <Alert severity="error" sx={{ m: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  if (clients.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
        No clients found.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '600px', overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {clients.length > 0 && Object.keys(clients[0]).map((header) => (
              <TableCell key={header}>
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={clients.length > 0 ? Object.keys(clients[0]).length + 1 : 1}>
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={clients.length > 0 ? Object.keys(clients[0]).length + 1 : 1}>
                <Alert severity="error" sx={{ m: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </Alert>
              </TableCell>
            </TableRow>
          ) : clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={clients.length > 0 ? Object.keys(clients[0]).length + 1 : 1}>
                <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
                  No clients found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id} hover>
                {Object.entries(client).map(([key, value]) => (
                  <TableCell key={`${client.id}-${key}`}>
                    {key === 'avatar' ? (
                      <Avatar src={value} />
                    ) : (
                      value?.toString()
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    onClick={() => handleViewClient(client.id)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientTable;
