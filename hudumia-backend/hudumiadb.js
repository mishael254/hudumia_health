const { Pool } = require('pg');

const pool = new Pool({
  user: 'mishael',
  host: 'localhost',
  database: 'hudumia_health_db',
  password: 'mishael2019.',
  port: 5432,
});

module.exports = pool;