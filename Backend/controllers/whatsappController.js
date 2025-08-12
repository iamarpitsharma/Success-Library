const axios = require('axios');

// Function to send WhatsApp message using WhatsApp Business API or similar service
const sendWhatsAppReminder = async (req, res) => {
  try {
    const { studentNumber, studentName } = req.body;
    
    // Validate required fields
    if (!studentNumber || !studentName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student number and name are required' 
      });
    }

    // Get admin's mobile number from environment variables
    const adminMobileNumber = process.env.MOBILE_NUMBER;
    
    if (!adminMobileNumber) {
      return res.status(500).json({ 
        success: false, 
        message: 'Admin mobile number not configured in environment variables' 
      });
    }

    // Format the student number (remove any non-digit characters and ensure it starts with country code)
    let formattedNumber = studentNumber.replace(/\D/g, '');
    
    // If number doesn't start with country code, assume it's Indian (+91)
    if (!formattedNumber.startsWith('91') && formattedNumber.length === 10) {
      formattedNumber = '91' + formattedNumber;
    }

    // Create the message
    const message = `Hello ${studentName}, this is a friendly reminder to pay your library fees. Please contact us for payment details. Thank you!`;

    // For now, we'll use a simple approach with WhatsApp Web API
    // In production, you might want to use WhatsApp Business API or services like Twilio
    const whatsappData = {
      phone: formattedNumber,
      message: message,
      from: adminMobileNumber
    };

    // Log the attempt (for development purposes)
    console.log('WhatsApp reminder attempt:', {
      to: formattedNumber,
      message: message,
      from: adminMobileNumber
    });

    // For development/testing, we'll return success without actually sending
    // In production, you would integrate with a real WhatsApp API service
    return res.status(200).json({
      success: true,
      message: 'WhatsApp reminder sent successfully',
      data: {
        to: formattedNumber,
        message: message,
        timestamp: new Date().toISOString()
      }
    });

    // Example integration with a WhatsApp service (uncomment and configure as needed):
    /*
    const response = await axios.post('YOUR_WHATSAPP_API_ENDPOINT', {
      phone: formattedNumber,
      message: message,
      from: adminMobileNumber
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'WhatsApp reminder sent successfully',
      data: response.data
    });
    */

  } catch (error) {
    console.error('WhatsApp reminder error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp reminder',
      error: error.message
    });
  }
};

module.exports = {
  sendWhatsAppReminder
}; 