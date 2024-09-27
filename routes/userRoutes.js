const express = require('express');
const { getAvailability, bookSeat, getBookingDetails } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/availability', authenticateJWT, getAvailability);
router.post('/book-seat', authenticateJWT, bookSeat);
router.get('/booking-details', authenticateJWT, getBookingDetails);

module.exports = router;
