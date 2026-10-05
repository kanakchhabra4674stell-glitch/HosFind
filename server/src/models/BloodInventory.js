const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  hospitalName: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  bloodGroup: { type: String, required: true },
  units: { type: Number, default: 0 },
  status: { type: String, enum: ['Available', 'Low Stock', 'Out of Stock'], default: 'Available' },
  verificationStatus: { type: String, default: 'Verified' },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
