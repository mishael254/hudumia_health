// hudumia-backend/serverside.js

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3004;
const pool = require('./hudumiadb');

const {hashPassword, comparePassword, generateToken} = require('./utils/auth');
const { generate2FASecret } = require('./utils/2fa');

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
//test the db connectivity
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

//doctors signup
app.post('/api/doctors/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if doctor already exists
    const existing = await pool.query('SELECT * FROM doctors WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Doctor already exists' });
    }

    const passwordHash = await hashPassword(password);
    const { ascii: twoFASecret, qrCode } = await generate2FASecret(email);

    const result = await pool.query(
      `INSERT INTO doctors (name, email, password_hash, two_fa_secret)
       VALUES ($1, $2, $3, $4) RETURNING id, email`,
      [name, email, passwordHash, twoFASecret]
    );

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: result.rows[0],
      twoFAQRCode: qrCode,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});