const jwt = require('jsonwebtoken');

// Middleware for verifying user JWT Token)
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    // Verify JWT token 
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Middleware for verifying admin (API key + JWT with admin role)
const adminAuth = (req, res, next) => {
    // Verify Admin API Key
    const apiKey = req.header('admin-api-key');
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
        return res.status(403).send('Forbidden: Invalid or missing API key');
    }
    // Verify JWT token
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied: No token provided');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        // Check if user role is admin
        if (verified.role !== 'admin') {
            return res.status(403).send('Access Denied: Admins only', verified.role);
        }
        next();
    } catch (err) {
        return res.status(400).send('Invalid Token');
    }
};
module.exports = { authenticateJWT, adminAuth };
