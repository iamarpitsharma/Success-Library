const express = require('express');
const router = express.Router();
const { sendWhatsAppReminder } = require('../controllers/whatsappController');
const auth = require('../middleware/auth');

// Route to send WhatsApp payment reminder
router.post('/send-reminder', auth, sendWhatsAppReminder);

module.exports = router; 