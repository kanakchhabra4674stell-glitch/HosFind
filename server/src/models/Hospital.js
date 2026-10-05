const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  treatments: [{ type: String }],
  specialists: [{ type: String }],
  emergencyAvailable: { type: Boolean, default: true },
  icuAvailable: { type: Boolean, default: true },
  icuTotal: { type: Number, default: 20 },
  icuAvailableBeds: { type: Number, default: 5 },
  ambulanceAvailable: { type: Boolean, default: true },
  pharmacyAvailable: { type: Boolean, default: true },
  bloodAvailability: {
    'A+': { type: Number, default: 0 },
    'A-': { type: Number, default: 0 },
    'B+': { type: Number, default: 0 },
    'B-': { type: Number, default: 0 },
    'AB+': { type: Number, default: 0 },
    'AB-': { type: Number, default: 0 },
    'O+': { type: Number, default: 0 },
    'O-': { type: Number, default: 0 }
  },
  medicines: [{
    name: { type: String, required: true },
    available: { type: Boolean, default: true },
    quantity: { type: Number, default: 10 }
  }],
  openStatus: { type: String, default: 'Open 24/7' },
  verificationStatus: { type: String, default: 'Verified Partner' },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);
