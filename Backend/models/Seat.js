const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId: {
    type: String,
    required: true,
    unique: true
  },
  row: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  // Support for multiple members per seat with time slots
  members: [{
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
    shift: {
      type: String,
      required: true,
      enum: ['Half Day (8 AM - 2 PM)', 'Half Day (2 PM - 8 PM)', 'Full Day (8 AM - 8 PM)', 'Custom']
    },
    customStartTime: {
      type: String,
      default: null
    },
    customEndTime: {
      type: String,
      default: null
    },
    occupiedDate: {
      type: Date,
      default: Date.now
    }
  }],
  // Legacy fields for backward compatibility
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: false
  },
  memberName: {
    type: String,
    required: false
  },
  memberContact: {
    type: String,
    required: false
  },
  occupiedDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat; 