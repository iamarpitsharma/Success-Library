const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get all seats
router.get('/', seatController.getAllSeats);

// Get available seats
router.get('/available', seatController.getAvailableSeats);

// Test seat assignment (for debugging)
router.get('/test/assignment', seatController.testSeatAssignment);

// Get seat by ID
router.get('/:seatId', seatController.getSeatById);

// Assign seat to member
router.post('/assign', seatController.assignSeat);

// Vacate seat
router.post('/vacate', seatController.vacateSeat);

// Data synchronization endpoint
router.post('/sync', seatController.syncData);

module.exports = router; 