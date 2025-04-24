const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = 'your_jwt_secret'; // Replace with env variable in production

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};