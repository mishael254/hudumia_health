import { 
    Box, 
     
    Card, 
    CardContent, 
    Typography,
    useTheme,
    useMediaQuery,
    Grow,
    Zoom,
    
    LinearProgress,
    Collapse,
    IconButton
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
  import "react-circular-progressbar/dist/styles.css";
  import { useNavigate } from "react-router-dom";
  import AltSidebar from "../../../sidebars/AltSidebar";
  import { getDashboardStats } from "../../../../services/Api";
  import CountUp from 'react-countup';
  import ClientTable from "./ClientTable";
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
  import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
  import Avatar from '@mui/material/Avatar';
  import PersonAddIcon from '@mui/icons-material/PersonAdd';
  import CreateIcon from '@mui/icons-material/Create';



  const ClientDashboard = () => {
    const [percentage, setPercentage] = useState(0);
    const [clientCount, setClientCount] = useState(0);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showClientTable, setShowClientTable] = useState(false);
    
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const CLIENT_GOAL = 500;
  
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
    const handleCreateClientClick = () => {
      navigate("/new-client");
    };
  
    const toggleClientTable = () => {
      setShowClientTable(!showClientTable);
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
            {/* Progress Card - now clickable */}
            <Grow in={!loading} timeout={500}>
              <Card 
                sx={{ 
                  flex: "1", 
                  minWidth: "300px", 
                  p: 2,
                  borderRadius: '16px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                    cursor: 'pointer'
                  },
                  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)'
                }}
                onClick={toggleClientTable}
              >
                <CardContent sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  gap: 2
                }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                    <Typography variant="h5" gutterBottom sx={{ 
                      fontWeight: '600',
                      color: theme.palette.text.secondary
                    }}>
                      Total Clients
                    </Typography>
                    <IconButton size="small">
                      {showClientTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </Box>
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
                    borderRadius: '16px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                    },
                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)'
                  }}
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
                      Client Actions
                    </Typography>
      
                  <Box display="flex" gap={4} justifyContent="center" width="100%">
                    {/* Enroll Client Option */}
                    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                      <Box 
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        }}
                        onClick={handleEnrollClick}
                      >
                        <Avatar sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 60,
                          height: 60,
                          mb: 1
                        }}>
                          <PersonAddIcon fontSize="medium" />
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                          Enroll Client
                        </Typography>
                      </Box>
                </Zoom>
        
        {/* Create Client Option */}
                  <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                    <Box 
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                      onClick={handleCreateClientClick}
                    >
                      <Avatar sx={{
                        bgcolor: theme.palette.secondary.main,
                        width: 60,
                        height: 60,
                        mb: 1
                      }}>
                        <CreateIcon fontSize="medium" />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary }}>
                        Create Client
                      </Typography>
                    </Box>
                  </Zoom>
                </Box>
              </CardContent>
            </Card>
          </Zoom>
          </Box>
  
          {/* Client Table - Collapsible */}
          <Collapse in={showClientTable} timeout="auto" unmountOnExit>
            <Box mt={4}>
              <Card sx={{ 
                borderRadius: '16px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <ClientTable />
              </Card>
            </Box>
          </Collapse>
        </Box>  
      </div>
    );
  };
  
  export default ClientDashboard;