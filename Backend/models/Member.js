const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 25 },
  fatherName: { type: String, required: true, maxLength: 25 },
  contact: { type: String, required: true, maxLength: 10 },
  aadhar: { type: String, required: true, unique: true, maxLength: 14 },
  address: { type: String, required: true, maxLength: 50 },
  gender: { type: String, required: true, enum: ['Male', 'Female'] },
  shift: { type: String, required: true },
  customStartTime: { type: String, default: null },
  customEndTime: { type: String, default: null },
  timing: { type: String, required: true },
  monthlyFees: { type: Number, required: false },
  joiningDate: { type: Date, default: Date.now },
  feesPaidTill: { type: Date },
  paymentMode: { type: String, required: false },
  profilePicture: { type: String }, // URL to the uploaded image
  seat: { type: String },
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
