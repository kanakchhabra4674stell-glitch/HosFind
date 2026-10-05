const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
const BloodInventory = require('./models/BloodInventory');
const Medicine = require('./models/Medicine');
const initialHospitals = require('./data/seedData');

let isMemoryFallback = false;
let memoryHospitals = [];

async function seedDatabase() {
  try {
    const count = await Hospital.countDocuments();
    if (count === 0) {
      console.log('Seeding initial hospital data into MongoDB...');
      const created = await Hospital.insertMany(initialHospitals);
      
      for (const h of created) {
        if (h.bloodAvailability) {
          for (const [group, units] of Object.entries(h.bloodAvailability)) {
            await BloodInventory.create({
              hospitalId: h._id,
              hospitalName: h.name,
              address: h.address,
              phone: h.phone,
              latitude: h.latitude,
              longitude: h.longitude,
              bloodGroup: group,
              units: units,
              status: units > 5 ? 'Available' : units > 0 ? 'Low Stock' : 'Out of Stock',
              verificationStatus: h.verificationStatus,
              lastUpdated: h.lastUpdated
            });
          }
        }
        if (h.medicines && h.medicines.length > 0) {
          for (const med of h.medicines) {
            await Medicine.create({
              hospitalId: h._id,
              hospitalName: h.name,
              address: h.address,
              phone: h.phone,
              latitude: h.latitude,
              longitude: h.longitude,
              name: med.name,
              available: med.available,
              quantity: med.quantity,
              verificationStatus: h.verificationStatus,
              lastUpdated: h.lastUpdated
            });
          }
        }
      }
      console.log(`Successfully seeded ${created.length} hospitals into MongoDB.`);
    } else {
      console.log(`Database already contains ${count} hospitals.`);
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital-finder';
  
  try {
    console.log(`Attempting to connect to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500
    });
    console.log('Connected to MongoDB successfully!');
    await seedDatabase();
  } catch (err) {
    console.warn(`MongoDB not available (${err.message}). Activating In-Memory Hospital Store.`);
    isMemoryFallback = true;
    memoryHospitals = initialHospitals.map((h, idx) => ({
      ...h,
      _id: `demo_hosp_${idx + 1}`
    }));
    console.log(`In-Memory Hospital Store initialized with ${memoryHospitals.length} demo hospitals.`);
  }
}

// Data Access Abstractions
async function getAllHospitals() {
  if (isMemoryFallback) return memoryHospitals;
  try {
    return await Hospital.find().lean();
  } catch (e) {
    return memoryHospitals;
  }
}

async function getHospitalById(id) {
  if (isMemoryFallback) {
    return memoryHospitals.find(h => String(h._id) === String(id)) || null;
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return memoryHospitals.find(h => String(h._id) === String(id)) || null;
    }
    return await Hospital.findById(id).lean();
  } catch (e) {
    return memoryHospitals.find(h => String(h._id) === String(id)) || null;
  }
}

async function createHospital(data) {
  if (isMemoryFallback) {
    const newHosp = {
      ...data,
      _id: `demo_hosp_${Date.now()}`,
      lastUpdated: new Date()
    };
    memoryHospitals.push(newHosp);
    return newHosp;
  }
  const hosp = new Hospital({ ...data, lastUpdated: new Date() });
  return await hosp.save();
}

async function updateHospital(id, data) {
  const updatePayload = {
    ...data,
    lastUpdated: new Date()
  };

  if (isMemoryFallback) {
    const idx = memoryHospitals.findIndex(h => String(h._id) === String(id));
    if (idx !== -1) {
      memoryHospitals[idx] = { ...memoryHospitals[idx], ...updatePayload };
      return memoryHospitals[idx];
    }
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const idx = memoryHospitals.findIndex(h => String(h._id) === String(id));
    if (idx !== -1) {
      memoryHospitals[idx] = { ...memoryHospitals[idx], ...updatePayload };
      return memoryHospitals[idx];
    }
    return null;
  }

  const updated = await Hospital.findByIdAndUpdate(id, updatePayload, { new: true });
  return updated;
}

async function getBloodInventory(group) {
  if (isMemoryFallback || true) { // Always reliable
    const results = [];
    for (const h of (memoryHospitals.length > 0 ? memoryHospitals : initialHospitals)) {
      if (h.bloodAvailability) {
        if (!group || group === 'ALL') {
          for (const [bg, units] of Object.entries(h.bloodAvailability)) {
            results.push({
              hospitalId: h._id || h.name,
              hospitalName: h.name,
              address: h.address,
              phone: h.phone,
              latitude: h.latitude,
              longitude: h.longitude,
              bloodGroup: bg,
              units: units,
              status: units > 5 ? 'Available' : units > 0 ? 'Low Stock' : 'Out of Stock',
              verificationStatus: h.verificationStatus,
              lastUpdated: h.lastUpdated
            });
          }
        } else if (h.bloodAvailability[group] !== undefined) {
          const units = h.bloodAvailability[group];
          results.push({
            hospitalId: h._id || h.name,
            hospitalName: h.name,
            address: h.address,
            phone: h.phone,
            latitude: h.latitude,
            longitude: h.longitude,
            bloodGroup: group,
            units: units,
            status: units > 5 ? 'Available' : units > 0 ? 'Low Stock' : 'Out of Stock',
            verificationStatus: h.verificationStatus,
            lastUpdated: h.lastUpdated
          });
        }
      }
    }
    return results;
  }
}

async function getMedicineInventory(searchName) {
  const results = [];
  const source = memoryHospitals.length > 0 ? memoryHospitals : initialHospitals;
  for (const h of source) {
    if (h.medicines) {
      for (const med of h.medicines) {
        if (!searchName || med.name.toLowerCase().includes(searchName.toLowerCase())) {
          results.push({
            hospitalId: h._id || h.name,
            hospitalName: h.name,
            address: h.address,
            phone: h.phone,
            latitude: h.latitude,
            longitude: h.longitude,
            name: med.name,
            available: med.available,
            quantity: med.quantity,
            verificationStatus: h.verificationStatus,
            lastUpdated: h.lastUpdated
          });
        }
      }
    }
  }
  return results;
}

module.exports = {
  connectDB,
  seedDatabase,
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  getBloodInventory,
  getMedicineInventory
};
