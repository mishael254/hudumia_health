const jwt = require ('jsonwebtoken');
const pool = require ('../hudumiadb');

const authenticateDoctor = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key'); // Use your actual secret key
        const doctorId = decoded.id;

        // Optionally, you can fetch the doctor from the database to ensure they still exist
        const result = await pool.query('SELECT id FROM doctors WHERE id = $1', [doctorId]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Unauthorized: Invalid doctor' });
        }

        req.doctorId = doctorId; // Attach doctor ID to the request object
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
