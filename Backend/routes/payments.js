const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Add new payment
router.post('/', paymentController.addPayment);

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get payments by member ID
router.get('/member/:memberId', paymentController.getPaymentsByMember);

// Get payment statistics
router.get('/stats', paymentController.getPaymentStats);

module.exports = router; 