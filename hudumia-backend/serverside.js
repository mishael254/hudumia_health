// hudumia-backend/serverside.js

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3004;

// Middleware
app.use(cors()); // allow frontend to access backend
app.use(express.json()); // allow JSON parsing

// Sample route
app.get("/api/health-check", (req, res) => {
  res.json({ status: "Hudumia backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
