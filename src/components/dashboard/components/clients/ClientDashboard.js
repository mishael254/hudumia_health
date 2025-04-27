import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [percentage, setPercentage] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let current = 0;
    const target = 50; // Assume 50 clients for now
    const interval = setInterval(() => {
      if (current >= target) {
        clearInterval(interval);
      } else {
        current += 1;
        setClientCount(current);
        setPercentage((current / target) * 100);
      }
    }, 30); // Animation speed
    return () => clearInterval(interval);
  }, []);

  const handleEnrollClick = () => {
    navigate("/enroll-client");
  };

  return (
    <Box m="20px">
      <Typography variant="h3" mb="20px">
        Manage Clients
      </Typography>

      <Box display="flex" gap="20px" flexWrap="wrap">

        {/* Total Clients Card */}
        <Card sx={{ flex: "1", minWidth: "300px", p: 2 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h5" gutterBottom>
              Total Clients
            </Typography>
            <Box width="150px" height="150px">
              <CircularProgressbar
                value={percentage}
                text={`${clientCount}`}
                styles={buildStyles({
                  textColor: "#4caf50",
                  pathColor: "#4caf50",
                  trailColor: "#d6d6d6",
                })}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Enroll Client Card */}
        <Card sx={{ flex: "1", minWidth: "300px", p: 2, cursor: "pointer" }} onClick={handleEnrollClick}>
          <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h5" gutterBottom>
              Enroll a New Client
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Enroll Now
            </Button>
          </CardContent>
        </Card>

      </Box>
    </Box>
  );
};

export default ClientDashboard;
