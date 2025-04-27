// src/components/LandingPage.js

import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardMedia, List, ListItem, ListItemText } from '@mui/material';
import { Person, LocalHospital, Assignment, Search, BarChart, Usb } from '@mui/icons-material';

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#2563eb', color: 'white', py: 2, boxShadow: 1 }}>
        <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            Hudumia Health System
          </Typography>
          <Button variant="contained" color="inherit" href="/login">
            Login
          </Button>
        </Container>
      </Box>

      {/* Navigation */}
      <Box sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Container>
          <Box component="nav">
            <List sx={{ display: 'flex', flexDirection: 'row', p: 0 }}>
              {['Home', 'About', 'Features', 'Programs', 'Contact'].map((item, index) => (
                <ListItem key={index} component="a" href="#" sx={{ textAlign: 'center', width: 'auto', py: 2, color: 'black', textDecoration: 'none', '&:hover': { color: '#2563eb' } }}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ backgroundColor: '#dbeafe', textAlign: 'center', py: 8 }}>
        <Container>
          <Typography variant="h3" component="h1" color="#1d4ed8" mb={2}>
            Simplifying Healthcare Management
          </Typography>
          <Typography variant="h6" color="#64748b" mb={4}>
            An advanced health information system designed for healthcare professionals to manage clients and health programs effectively.
          </Typography>
          <Button variant="contained" color="primary" size="large" href="/dashboard">
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container>
          <Typography variant="h4" align="center" color="#1d4ed8" mb={4}>
            Key Features
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <Person fontSize="large" />, title: 'Client Management', desc: 'Register new clients, maintain detailed profiles, and track their health journey in one centralized system.' },
              { icon: <LocalHospital fontSize="large" />, title: 'Health Programs', desc: 'Create and manage various health programs like TB, Malaria, HIV, and more with customizable parameters.' },
              { icon: <Assignment fontSize="large" />, title: 'Program Enrollment', desc: 'Easily enroll clients in one or multiple health programs and track their progress through treatment.' },
              { icon: <Search fontSize="large" />, title: 'Advanced Search', desc: 'Quickly find client records using various search parameters to access information when needed.' },
              { icon: <BarChart fontSize="large" />, title: 'Comprehensive Reports', desc: 'Generate detailed reports on client enrollment, program effectiveness, and treatment outcomes.' },
              { icon: <Usb fontSize="large" />, title: 'API Integration', desc: 'Connect with other healthcare systems through our secure API to share client information.' },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ p: 3, textAlign: 'center', borderTop: '4px solid #2563eb', height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 } }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" mb={1}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it Works Section */}
      <Box sx={{ py: 8, backgroundColor: '#f3f4f6' }}>
        <Container>
          <Typography variant="h4" align="center" color="#1d4ed8" mb={4}>
            How It Works
          </Typography>
          <Box maxWidth="800px" mx="auto">
            {[
              { step: '1', title: 'Register Clients', desc: 'Add new clients to the system with comprehensive profiles including personal details, medical history, and contact information.' },
              { step: '2', title: 'Create Health Programs', desc: 'Set up various health programs with specific parameters, treatment protocols, and duration.' },
              { step: '3', title: 'Enroll Clients in Programs', desc: 'Assign clients to relevant health programs based on their diagnosis.' },
              { step: '4', title: 'Track Progress and Generate Reports', desc: 'Monitor client progress through their treatment journey and generate detailed reports.' },
            ].map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 5 }}>
                <Box sx={{ backgroundColor: '#2563eb', color: 'white', width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {item.step}
                </Box>
                <Box>
                  <Typography variant="h6" mb={1}>
                    {item.title}
                  </Typography>
                  <Typography color="textSecondary">{item.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box sx={{ backgroundColor: '#1e293b', color: 'white', py: 6 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" mb={2}>
                Hudumia Health System
              </Typography>
              <Typography variant="body2" color="#cbd5e1">
                An advanced system simplifying client and program management for healthcare professionals.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" mb={2}>
                Links
              </Typography>
              <List>
                {['Home', 'About', 'Features', 'Programs', 'Contact'].map((text, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemText>
                      <Button sx={{ color: '#cbd5e1', textTransform: 'none' }} href="#">
                        {text}
                      </Button>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" mb={2}>
                Contact
              </Typography>
              <Typography variant="body2" color="#cbd5e1">
                Email: support@hudumiahealth.com
              </Typography>
              <Typography variant="body2" color="#cbd5e1">
                Phone: +254 700 000 000
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" mt={4} color="#cbd5e1">
            © {new Date().getFullYear()} Hudumia Health. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </div>
  );
};

export default LandingPage;
