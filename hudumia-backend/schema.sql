--creating a table to store doctors details
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  second_name VARCHAR(30) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(20) UNIQUE,
  password_hash TEXT NOT NULL,
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret TEXT, -- used if 2FA is enabled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--creating a table to store now the programs
CREATE TABLE health_programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--creating a table to store clients
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    second_name VARCHAR(20) NOT NULL,
    sir_name VARCHAR(20) NOT NULL,
    gender VARCHAR(10),
    date_of_birth DATE,
    phone_number VARCHAR(20) UNIQUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--create a table to now store program -enrollments
CREATE TABLE program_enrollments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    program_id INTEGER REFERENCES health_programs(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (client_id, program_id) -- Ensure a client can't be enrolled in the same program twice
);