const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: false 
  },
  memberName: { 
    type: String, 
    required: true 
  },
  memberContact: { 
    type: String, 
    required: true 
  },
  studentName: { 
    type: String, 
    required: true 
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMode: { 
    type: String, 
    required: true, 
    enum: ['Cash', 'Online', 'Card'] 
  },
  paymentProvider: { 
    type: String 
  },
  transactionId: { 
    type: String 
  },
  notes: { 
    type: String 
  },
  paymentDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    default: 'Completed', 
    enum: ['Pending', 'Completed', 'Failed'] 
  }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 