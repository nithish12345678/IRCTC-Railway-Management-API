const express = require('express');
const { addTrain } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add-train', adminAuth, addTrain);

module.exports = router;
