const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = (req, res) => {
    const { username, password, role = 'user' } = req.body; // Default role is 'user'

    // Ensure password is defined
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and Password are required' });
    }
    console.log("inside register function")
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Prevent users from registering as admin unless the request is properly authenticated using an admin API key
    if (role === 'admin' && req.headers['admin-api-key'] !== process.env.ADMIN_API_KEY) {
        return res.status(403).send('Unauthorized to create admin user');
    }

    User.register(username, hashedPassword, role, (err, result) => {
        if (err) return res.status(500).send('Error registering user');
        res.status(201).send('User registered successfully');
    });
};


exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and Password are required' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: results[0].id, role: results[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};
