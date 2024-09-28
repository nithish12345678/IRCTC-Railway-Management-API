const db = require('../config/db');

exports.addTrain = (req, res) => {
    const { train_name, source, destination, total_seats } = req.body;
    if (!train_name || !source || !destination || !total_seats) {
        return res.status(400).json({ error: 'Please provide all required details train name, total seats, source and destination stations name' });
    }
    db.query('INSERT INTO trains (train_name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
        [train_name, source, destination, total_seats, total_seats], (err) => {
            if (err) return res.status(500).send(err);
            res.status(201).send('Train added');
        });
};
