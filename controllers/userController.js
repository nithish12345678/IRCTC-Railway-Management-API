const db = require('../config/db');

// function to get available train from a source to destination
exports.getAvailability = (req, res) => {
    const { source, destination } = req.body;

    if (!source || !destination) {
        return res.status(400).json({ error: 'Please provide source and destination stations' });
    }
    db.query('SELECT * FROM trains WHERE source = ? AND destination = ?', [source, destination], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

// function to book seat in a train
// exports.bookSeat = (req, res) => {
//     const { train_id } = req.body;
//     const user_id = req.user.id;
//     if (!train_id) {
//         return res.status(400).json({ error: 'Please provide train id' });
//     }
//     db.query('SELECT available_seats FROM trains WHERE id = ?', [train_id], (err, results) => {
//         if (err) return res.status(500).send(err);
//         if (results && results[0]?.available_seats > 0) {
//             db.query('UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?', [train_id], (err) => {
//                 if (err) return res.status(500).send(err);
//                 db.query('INSERT INTO bookings (user_id, train_id) VALUES (?, ?)', [user_id, train_id], (err) => {
//                     if (err) return res.status(500).send(err);
//                     res.status(201).send('Seat booked');
//                 });
//             });
//         } else {
//             res.status(400).send('No seats available');
//         }
//     });
// };

// Function to booking seat with transaction to prevent race conditions
exports.bookSeat = (req, res) => {
    const { train_id } = req.body;
    const user_id = req.user.id;

    // new transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).send('Transaction failed');
        }

        // Lock the train row for this booking operation to prevent simultaneous updates
        db.query('SELECT available_seats FROM trains WHERE id = ? FOR UPDATE', [train_id], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).send('Failed to lock the seat for booking');
                });
            }

            if (results && results[0]?.available_seats > 0) {
                db.query('UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?', [train_id], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send('Failed to update seat count');
                        });
                    }

                    db.query('INSERT INTO bookings (user_id, train_id) VALUES (?, ?)', [user_id, train_id], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).send('Booking failed');
                            });
                        }

                        // Commit the transaction
                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).send('Transaction commit failed');
                                });
                            }
                            res.status(201).send('Seat booked successfully');
                        });
                    });
                });
            } else {
                db.rollback(() => {
                    res.status(400).send('No seats available');
                });
            }
        });
    });
};

// function to get all Booking Details
exports.getBookingDetails = (req, res) => {
    console.log("getBookingDetails");
    console.log("req.user :", req.user);
    const user_id = req.user.id;

    db.query('SELECT * FROM bookings WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};
// function to get Specific Booking Details
exports.getSpecificBookingDetails = (req, res) => {
    const bookingId = req.params.id; 
    if (!bookingId) {
        return res.status(400).json({ error: 'Booking ID is required' });
    }

    db.query('SELECT * FROM bookings WHERE id = ?', [bookingId], (err, results) => {
        if (err) return res.status(500).send(err);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(results[0]);
    });
};


// function to get all train details
exports.getAllTrains = (req, res) => {
    db.query('SELECT id, train_name, available_seats, source, destination FROM trains', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving train data', details: err });
        }
        res.status(200).json(results);
    });
};