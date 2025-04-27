// src/components/dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/Api'; // adjust path if needed
import { Card, CardContent, Typography, Grid } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Sidebar from '../sidebars/Sidebar';

function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      
      <Grid container spacing={3}>
        {/* Total Clients Card */}
        <Sidebar/>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <GroupIcon sx={{ fontSize: 40 }} />
                </Grid>
                <Grid item>
                  <Typography variant="h5" component="div">
                    {stats.totalClients}
                  </Typography>
                  <Typography variant="subtitle1">
                    Total Clients
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Programs Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ backgroundColor: '#388e3c', color: '#fff' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <LibraryBooksIcon sx={{ fontSize: 40 }} />
                </Grid>
                <Grid item>
                  <Typography variant="h5" component="div">
                    {stats.totalPrograms}
                  </Typography>
                  <Typography variant="subtitle1">
                    Total Programs
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;