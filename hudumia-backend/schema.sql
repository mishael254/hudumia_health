--creating a table to store doctors details
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  password_hash TEXT NOT NULL,
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret TEXT, -- used if 2FA is enabled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);