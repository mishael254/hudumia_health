// hudumia-backend/serverside.js

const express = require("express");
const cors = require("cors");
const { Pool } = require('pg'); //  Use Pool for connection pooling
const { hashPassword, comparePassword, generateToken } = require('./utils/auth');
const { generate2FASecret } = require('./utils/2fa');
const { verify2FAToken } = require('./utils/2fa');
const authenticateDoctor = require('./middleware/authMiddleware');
const crypto = require('crypto');
require('dotenv').config();
const transporter = require('./utils/emailConfig');

const app = express();
const PORT = 3004;

//  Use a connection pool.  Important for performance and preventing connection issues.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, //  Use environment variable
});

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get("/api/health-check", (req, res) => {
    res.json({ status: "Hudumia backend is running" });
});

// Test the db connectivity
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ time: result.rows[0].now });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database connection failed', details: err.message }); // Include details
    }
});

// Doctors signup
app.post('/api/doctors/signup', async (req, res) => {
    const { firstName, secondName, userName, email, phoneNumber, password } = req.body;

    try {
        // Check if doctor already exists (email or phone_number or username) - important to check both
        const existing = await pool.query('SELECT * FROM doctors WHERE email = $1 OR phone_number = $2 OR user_name = $3', [email, phoneNumber, userName]);
        if (existing.rows.length > 0) {
          if (existing.rows.some(row => row.email === email)) {
              return res.status(400).json({ error: 'Email already exists' });
          } else if (existing.rows.some(row => row.phone_number === phoneNumber)) {
              return res.status(400).json({ error: 'Phone number already exists' });
          } else {
              return res.status(400).json({ error: 'Username already exists' }); // ADDED THIS
          }
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
        console.error('Error during signup:', err);
        res.status(500).json({ error: 'Signup failed', details: err.message }); // Include details
    }
});

// Doctors sign in
app.post('/api/doctors/signin', async (req, res) => {
    const { identifier, password, token } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM doctors WHERE email = $1 OR user_name = $1',
            [identifier]
        );
        const doctor = result.rows[0];

        if (!doctor) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await comparePassword(password, doctor.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        //  2FA Check
        const is2FAValid = token ? verify2FAToken(doctor.two_fa_secret, token) : true; //  IMPORTANT:  Allow login if no token
        if (!is2FAValid) {
            return res.status(401).json({ error: 'Invalid 2FA token' });
        }
      if (token === undefined || token === null || token === "")
      {
          const { ascii: twoFASecret, qrCode } = await generate2FASecret(doctor.email);
           await pool.query(
            'UPDATE doctors SET two_fa_secret = $1 WHERE id = $2',
            [twoFASecret,doctor.id]
           );
           return res.status(200).json({twoFAQRCode: qrCode})
      }

        const jwtToken = generateToken({ id: doctor.id, email: doctor.email });
        res.json({ message: 'Signin successful', token: jwtToken });

    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).json({ error: 'Signin failed', details: err.message }); // Include details
    }
});

// Initiating a password reset
app.post('/api/doctors/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const doctor = await pool.query('SELECT id, email FROM doctors WHERE email = $1', [email]);

        if (doctor.rows.length === 0) {
            return res.json({ message: 'Password reset email sent if the account exists' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000);

        await pool.query(
            'UPDATE doctors SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
            [resetToken, resetTokenExpiry, doctor.rows[0].id]
        );

        const resetLink = `https://your-frontend-domain.com/reset-password?token=${resetToken}&email=${email}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: doctor.rows[0].email,
            subject: 'Hudumia Health - Password Reset Request',
            html: `<p>You are receiving this email because you (or someone else) have requested a password reset for your account.</p>
                   <p>Please click on the following link to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link will expire in 1 hour.</p>
                   <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending reset email:', error);
                return res.status(500).json({ error: 'Failed to send password reset email', details: error.message }); // Include
            }
            console.log('Password reset email sent:', info.response);
            res.json({ message: 'Password reset email sent if the account exists' });
        });

    } catch (error) {
        console.error('Error processing forgot password request:', error);
        res.status(500).json({ error: 'Failed to process password reset request', details: error.message }); // Include
    }
});

// Doctors reset password
app.post('/api/doctors/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    try {
        const doctor = await pool.query(
            'SELECT id FROM doctors WHERE reset_token = $1 AND reset_token_expiry > NOW()',
            [token]
        );

        if (doctor.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const hashedPassword = await hashPassword(newPassword);

        await pool.query(
            'UPDATE doctors SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
            [hashedPassword, doctor.rows[0].id]
        );

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password', details: error.message }); // Include details
    }
});

// --------------------- Health Programs Routes ---------------------

// Create a new health program
app.post('/api/programs', authenticateDoctor, async (req, res) => {
    const { name, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO health_programs (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ error: 'Failed to create health program', details: error.message }); // Include
    }
});
// Get a list of all health programs
app.get('/api/programs', authenticateDoctor, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM health_programs');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ error: 'Failed to fetch health programs', details: error.message }); // Include
    }
});

// Get details of a specific health program
app.get('/api/programs/:id', authenticateDoctor, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM health_programs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Health program not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching program:', error);
        res.status(500).json({ error: 'Failed to fetch health program', details: error.message }); // Include
    }
});
// Update an existing health program
app.put('/api/programs/:id', authenticateDoctor, async (req, res) => {
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
        res.status(500).json({ error: 'Failed to update health program', details: error.message }); // Include
    }
});
// Delete a health program
app.delete('/api/programs/:id', authenticateDoctor, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM health_programs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Health program not found' });
        }
        res.json({ message: 'Health program deleted successfully' });
    } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ error: 'Failed to delete health program', details: error.message }); // Include
    }
});

// --------------------- Clients Routes ---------------------

// Create a new client
app.post('/api/clients', authenticateDoctor, async (req, res) => {
    const { first_name, second_name, sir_name, gender, date_of_birth, phone_number } = req.body;
    try {
      // Check if phone number already exists
      const phoneCheckQuery = 'SELECT * FROM clients WHERE phone_number = $1';
      const phoneCheckResult = await pool.query(phoneCheckQuery, [phone_number]);

      if (phoneCheckResult.rows.length > 0) {
          return res.status(409).json({ error: "Phone number already exists" });
      }
        const result = await pool.query(
            'INSERT INTO clients (first_name, second_name, sir_name, gender, date_of_birth, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [first_name, second_name, sir_name, gender, date_of_birth, phone_number]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating client:', error);
         if (error.code === '23505') {
            return res.status(400).json({ error: 'Client with this phone number already exists.' });
        }
        res.status(500).json({ error: 'Failed to register client', details: error.message }); // Include
    }
});
// Get a list of all registered clients
app.get('/api/clients', authenticateDoctor, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clients');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients', details: error.message }); // Include
    }
});

// --------------------- implementing Client Search Route ---------------------

app.get('/api/clients/search', authenticateDoctor, async (req, res) => {
    const { name, phoneNumber, dateOfBirth } = req.query;
    const conditions = [];
    const values = [];
    let query = `
        SELECT id, first_name, second_name, sir_name, gender, date_of_birth, phone_number, registration_date
        FROM clients
    `;
    let paramIndex = 1;

    if (name) {
        conditions.push(`(first_name ILIKE $${paramIndex} OR second_name ILIKE $${paramIndex} OR sir_name ILIKE $${paramIndex})`);
        values.push(`%${name}%`);
        paramIndex++;
    }

    if (phoneNumber) {
        conditions.push(`phone_number ILIKE $${paramIndex}`);
        values.push(`%${phoneNumber}%`);
        paramIndex++;
    }

    if (dateOfBirth) {
        conditions.push(`date_of_birth::TEXT LIKE $${paramIndex}`);
        values.push(`%${dateOfBirth}%`);
        paramIndex++;
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error searching clients:', error);
        res.status(500).json({ error: 'Failed to search clients', details: error.message }); // Include
    }
});

// Get details of a specific client
app.get('/api/clients/:id', authenticateDoctor, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Failed to fetch client', details: error.message }); // Include
    }
});
// Update an existing client's information
app.put('/api/clients/:id', authenticateDoctor, async (req, res) => {
    const { id } = req.params;
    const { first_name, second_name, sir_name, gender, date_of_birth, phone_number } = req.body;
    try {
        const result = await pool.query(
            'UPDATE clients SET first_name = $1, second_name = $2, sir_name = $3, gender = $4, date_of_birth = $5, phone_number = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
            [first_name, second_name, sir_name, gender, date_of_birth, phone_number, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Failed to update client', details: error.message }); // Include
    }
});
// Delete a client
app.delete('/api/clients/:id', authenticateDoctor, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Failed to delete client', details: error.message }); // Include
    }
});
// --------------------- Program Enrollments Routes ---------------------

// Enroll a client in a program
app.post('/api/enrollments', authenticateDoctor, async (req, res) => {
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
        res.status(500).json({ error: 'Failed to enroll client in program', details: error.message }); // Include
    }
});
// Get all programs a specific client is enrolled in
app.get('/api/clients/:clientId/enrollments', authenticateDoctor, async (req, res) => {
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
        res.status(500).json({ error: 'Failed to fetch client enrollments', details: error.message }); // Include
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
