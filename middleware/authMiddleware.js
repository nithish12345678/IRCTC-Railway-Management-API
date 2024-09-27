const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

const adminAuth = (req, res, next) => {
    const apiKey = req.header('admin-api-key');
    if (apiKey === process.env.ADMIN_API_KEY) {
        next();
    } else {
        res.status(403).send('Forbidden: Invalid API Key');
    }
};

module.exports = { authenticateJWT, adminAuth };
