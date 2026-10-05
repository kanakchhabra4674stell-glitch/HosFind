const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  hospitalName: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  name: { type: String, required: true },
  available: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  verificationStatus: { type: String, default: 'Verified' },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);
