const express = require('express');
const { getAvailability, bookSeat, getBookingDetails, getAllTrains } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/availability', authenticateJWT, getAvailability);
router.post('/book-seat', authenticateJWT, bookSeat);
router.get('/booking-details', authenticateJWT, getBookingDetails);
router.get('/bookings/:id', authenticateJWT, getSpecificBookingDetails);
router.get('/trains', getAllTrains);

module.exports = router;
