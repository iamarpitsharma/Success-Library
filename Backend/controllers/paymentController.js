const Payment = require('../models/Payment');
const Member = require('../models/Member');

// Add new payment
exports.addPayment = async (req, res) => {
  try {
    console.log('Payment data received:', req.body);
    
    const newPayment = new Payment(req.body);
    const payment = await newPayment.save();

    // Update member's fees paid till date if needed
    if (req.body.updateFeesPaidTill && req.body.memberId) {
      await Member.findByIdAndUpdate(req.body.memberId, {
        feesPaidTill: req.body.feesPaidTill
      });
    }

    res.json(payment);
  } catch (err) {
    console.error('Payment creation error:', err.message);
    console.error('Error details:', err);
    res.status(500).json({ 
      msg: 'Server Error', 
      error: err.message 
    });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ paymentDate: -1 })
      .populate('memberId', 'name contact');
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get payments by member ID
exports.getPaymentsByMember = async (req, res) => {
  try {
    const payments = await Payment.find({ memberId: req.params.memberId })
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const totalAmount = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const monthlyStats = await Payment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({
      totalPayments,
      totalAmount: totalAmount[0]?.total || 0,
      monthlyStats
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 