// hudumia-backend/serverside.js

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3004;
const pool = require('./hudumiadb');

const {hashPassword, comparePassword, generateToken} = require('./utils/auth');
const { generate2FASecret } = require('./utils/2fa');

const { verify2FAToken } = require('./utils/2fa');

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
  const { firstName, secondName, userName, email,phoneNumber, password } = req.body;

  try {
    // Check if doctor already exists
    const existing = await pool.query('SELECT * FROM doctors WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Doctor already exists' });
    }

    const passwordHash = await hashPassword(password);
    const { ascii: twoFASecret, qrCode } = await generate2FASecret(email);

    const result = await pool.query(
      `INSERT INTO doctors (first_name, second_name, user_name, email, phone_number, password_hash, two_fa_secret)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email`,
      [firstName, secondName, userName, email, phoneNumber, passwordHash, twoFASecret]
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

//doctors sign in

app.post('/api/doctors/signin', async (req, res) => {
  const { identifier, password, token } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM doctors WHERE email = $1 OR user_name = $1',
      [identifier]
    );
    const doctor = result.rows[0];

    if (!doctor || !(await comparePassword(password, doctor.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const is2FAValid = verify2FAToken(doctor.two_fa_secret, token);
    if (!is2FAValid) {
      return res.status(401).json({ error: 'Invalid 2FA token' });
    }

    const jwtToken = generateToken({ id: doctor.id, email: doctor.email });

    res.json({ message: 'Signin successful', token: jwtToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signin failed' });
  }
});

// Create a new health program
app.post('/api/programs', async (req, res) => {
  const { name, description } = req.body;
  try {
      const result = await pool.query(
          'INSERT INTO health_programs (name, description) VALUES ($1, $2) RETURNING *',
          [name, description]
      );
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error creating program:', error);
      res.status(500).json({ error: 'Failed to create health program' });
  }
});
// Get a list of all health programs
app.get('/api/programs', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM health_programs');
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching programs:', error);
      res.status(500).json({ error: 'Failed to fetch health programs' });
  }
});

//Get details of a specific health program
app.get('/api/programs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM health_programs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Health program not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({ error: 'Failed to fetch health program' });
    }
});