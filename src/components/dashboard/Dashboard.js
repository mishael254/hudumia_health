// src/components/dashboard/Dashboard.js
import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/Api'; // adjust path if needed
import { Card, CardContent, Typography, Grid } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // <- missing in your code
import Sidebar from '../sidebars/Sidebar';
import CountUp from 'react-countup';

function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPrograms: 0,
    totalEnrollments: 0,
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

  // You missed defining this in your code
  const cardStyleOrange = {
    backgroundColor: '#f57c00',
    color: '#fff',
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flexGrow: 1, padding: '2rem' }}>
        <Grid container spacing={3}>
          
          {/* Total Clients Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#1976d2', color: '#fff' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <GroupIcon sx={{ fontSize: 40 }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" component="div">
                      <CountUp end={stats.totalClients} duration={1.5} />
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
                      <CountUp end={stats.totalPrograms} duration={1.5} />
                    </Typography>
                    <Typography variant="subtitle1">
                      Total Programs
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Enrollments Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={cardStyleOrange}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <AssignmentTurnedInIcon sx={{ fontSize: 40 }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" component="div">
                      <CountUp end={stats.totalEnrollments} duration={1.5} />
                    </Typography>
                    <Typography variant="subtitle1">
                      Total Enrollments
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </div>
    </div>
  );
}

export default Dashboard;
