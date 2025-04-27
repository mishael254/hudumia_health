import { 
    Box, 
    Button, 
    Card, 
    CardContent, 
    Typography,
    useTheme,
    useMediaQuery,
    Grow,
    Zoom,
    Fade,
    LinearProgress
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
  import { useNavigate } from "react-router-dom";
  import AltSidebar from "../../../sidebars/AltSidebar";
  import { getDashboardStats } from "../../../../services/Api";
  import CountUp from 'react-countup';
  
  const ClientDashboard = () => {
    const [percentage, setPercentage] = useState(0);
    const [clientCount, setClientCount] = useState(0);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const CLIENT_GOAL = 500; // Set your target goal here
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getDashboardStats();
          setStats(data);
          
          // Animate the client count
          let current = 0;
          const target = data.totalClients;
          const interval = setInterval(() => {
            if (current >= target) {
              clearInterval(interval);
            } else {
              current += 1;
              setClientCount(current);
              // Calculate percentage towards our goal of 500 clients
              setPercentage((current / CLIENT_GOAL) * 100);
            }
          }, 30);
          
          setLoading(false);
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
          setLoading(false);
        }
      };
      
      fetchData();
    }, []);
  
    const handleEnrollClick = () => {
      navigate("/enroll-client");
    };
  
    return (
      <div style={{ display: 'flex' }}>
        <AltSidebar />
        <Box m="20px" width="100%">
          <Typography variant="h3" mb="20px" sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
          }}>
            Manage Clients
          </Typography>
  
          <Box 
            display="flex" 
            gap="20px" 
            flexWrap="wrap"
            justifyContent={isMobile ? 'center' : 'flex-start'}
          >
            {/* Total Clients Card */}
            <Grow in={!loading} timeout={500}>
              <Card sx={{ 
                flex: "1", 
                minWidth: "300px", 
                p: 2,
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                },
                background: 'linear-gradient(145deg, #ffffff, #f0f0f0)'
              }}>
                <CardContent sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  gap: 2
                }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: '600',
                    color: theme.palette.text.secondary
                  }}>
                    Client Progress
                  </Typography>
                  <Box width="150px" height="150px">
                    <CircularProgressbar
                      value={percentage}
                      text={<CountUp end={clientCount} duration={2.5} />}
                      styles={buildStyles({
                        textSize: '24px',
                        textColor: theme.palette.primary.main,
                        pathColor: theme.palette.primary.main,
                        trailColor: theme.palette.grey[300],
                        pathTransitionDuration: 1.5,
                      })}
                    />
                  </Box>
                  <Typography variant="subtitle1" sx={{ 
                    color: theme.palette.text.secondary,
                    mt: 1
                  }}>
                    {clientCount} / {CLIENT_GOAL} clients
                  </Typography>
                  <Box width="100%" mt={2}>
                    <LinearProgress 
                      variant="determinate" 
                      value={percentage} 
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: theme.palette.grey[300],
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          backgroundColor: theme.palette.primary.main
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.text.secondary,
                    mt: 1
                  }}>
                    {Math.round(percentage)}% towards our goal
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
  
            {/* Enroll Client Card */}
            <Zoom in={!loading} timeout={700}>
              <Card 
                sx={{ 
                  flex: "1", 
                  minWidth: "300px", 
                  p: 2, 
                  cursor: "pointer",
                  borderRadius: '16px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                  },
                  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)'
                }} 
                onClick={handleEnrollClick}
              >
                <CardContent sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  height: '100%',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: '600',
                    color: theme.palette.text.secondary,
                    mb: 3
                  }}>
                    Enroll a New Client
                  </Typography>
                  <Fade in={true} timeout={1000}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ 
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      Enroll Now
                    </Button>
                  </Fade>
                </CardContent>
              </Card>
            </Zoom>
          </Box>
        </Box>  
      </div>
    );
  };
  
  export default ClientDashboard;