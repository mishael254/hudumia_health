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

// --------------------- Health Programs Routes ---------------------


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
// Update an existing health program
app.put('/api/programs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
      const result = await pool.query(
          'UPDATE health_programs SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
          [name, description, id]
      );
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Health program not found' });
      }
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error updating program:', error);
      res.status(500).json({ error: 'Failed to update health program' });
  }
});
// Delete a health program
app.delete('/api/programs/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('DELETE FROM health_programs WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Health program not found' });
      }
      res.json({ message: 'Health program deleted successfully' });
  } catch (error) {
      console.error('Error deleting program:', error);
      res.status(500).json({ error: 'Failed to delete health program' });
  }
});

// --------------------- Clients Routes ---------------------

// Create a new client
app.post('/api/clients', async (req, res) => {
  const { first_name,second_name, sir_name, gender, date_of_birth, phone_number } = req.body;
  try {
      const result = await pool.query(
          'INSERT INTO clients (first_name, second_name, sir_name, gender, date_of_birth, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [first_name,second_name,sir_name, gender, date_of_birth, phone_number]
      );
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Failed to register client' });
  }
});
// Get a list of all registered clients
app.get('/api/clients', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM clients');
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// --------------------- implementing Client Search Route ---------------------

app.get('/api/clients/search', async (req, res) => {
  const { name } = req.query;

  if (!name) {
      return res.status(400).json({ error: 'Search term is required' });
  }

  try {
      // Using ILIKE for case-insensitive partial matching
      const result = await pool.query(
          `SELECT id, first_name, second_name, sir_name, gender, date_of_birth, phone_number, registration_date
           FROM clients
           WHERE first_name ILIKE $1 OR second_name ILIKE $1 OR sir_name ILIKE $1`,
          [`%${name}%`]
      );
      res.json(result.rows);
  } catch (error) {
      console.error('Error searching clients:', error);
      res.status(500).json({ error: 'Failed to search clients' });
  }
});

// Get details of a specific client
app.get('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Client not found' });
      }
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({ error: 'Failed to fetch client' });
  }
});
// Update an existing client's information
app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, second_name, sir_name, gender, date_of_birth, phone_number } = req.body;
  try {
      const result = await pool.query(
          'UPDATE clients SET first_name = $1, second_name = $2, sir_name = $3, gender = $4, date_of_birth = $5, phone_number = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
          [first_name, second_name , sir_name ,  gender, date_of_birth, phone_number, id]
      );
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Client not found' });
      }
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({ error: 'Failed to update client' });
  }
});
// Delete a client
app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Client not found' });
      }
      res.json({ message: 'Client deleted successfully' });
  } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({ error: 'Failed to delete client' });
  }
});
// --------------------- Program Enrollments Routes ---------------------

// Enroll a client in a program
app.post('/api/enrollments', async (req, res) => {
  const { clientId, programId } = req.body;
  try {
      const result = await pool.query(
          'INSERT INTO program_enrollments (client_id, program_id) VALUES ($1, $2) RETURNING *',
          [clientId, programId]
      );
      res.status(201).json(result.rows[0]);
  } catch (error) {
      console.error('Error enrolling client:', error);
      if (error.code === '23505') { // Unique constraint violation
          return res.status(400).json({ error: 'Client is already enrolled in this program' });
      }
      res.status(500).json({ error: 'Failed to enroll client in program' });
  }
});
// Get all programs a specific client is enrolled in
app.get('/api/clients/:clientId/enrollments', async (req, res) => {
  const { clientId } = req.params;
  try {
      const result = await pool.query(
          `SELECT pe.enrollment_date, hp.id AS program_id, hp.name AS program_name, hp.description AS program_description
          FROM program_enrollments pe
          JOIN health_programs hp ON pe.program_id = hp.id
          WHERE pe.client_id = $1`,
          [clientId]
      );
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching enrollments:', error);
      res.status(500).json({ error: 'Failed to fetch client enrollments' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});