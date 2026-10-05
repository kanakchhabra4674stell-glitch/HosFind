const initialHospitals = [
  {
    name: "Sir Ganga Ram Hospital",
    address: "Rajinder Nagar, New Delhi, Delhi 110060",
    phone: "+91-11-25750000",
    latitude: 28.6385,
    longitude: 77.1894,
    treatments: ["Cardiology", "Neurology", "Pediatrics", "General Emergency", "Surgery", "Orthopedics"],
    specialists: ["Cardiologist", "Neurologist", "Pediatrician", "Surgeon"],
    emergencyAvailable: true,
    icuAvailable: true,
    icuTotal: 45,
    icuAvailableBeds: 5,
    ambulanceAvailable: true,
    pharmacyAvailable: true,
    bloodAvailability: {
      'A+': 16,
      'A-': 4,
      'B+': 22,
      'B-': 5,
      'AB+': 8,
      'AB-': 3,
      'O+': 18,
      'O-': 6
    },
    medicines: [
      { name: "Insulin", available: true, quantity: 40 },
      { name: "Heparin", available: true, quantity: 25 },
      { name: "Aspirin", available: true, quantity: 100 },
      { name: "Metoprolol", available: true, quantity: 50 }
    ],
    openStatus: "Open 24/7",
    verificationStatus: "Verified 5m ago",
    lastUpdated: new Date()
  },
  {
    name: "Apollo Heart & Super Speciality Institute",
    address: "Mathura Road, Jasola Vihar, New Delhi, Delhi 110076",
    phone: "+91-11-71791090",
    latitude: 28.5362,
    longitude: 77.2882,
    treatments: ["Cardiology", "General Emergency", "Surgery", "Orthopedics", "Maternity"],
    specialists: ["Cardiologist", "Surgeon", "Orthopedic Specialist", "Gynecologist"],
    emergencyAvailable: true,
    icuAvailable: true,
    icuTotal: 40,
    icuAvailableBeds: 8,
    ambulanceAvailable: true,
    pharmacyAvailable: true,
    bloodAvailability: {
      'A+': 12,
      'A-': 2,
      'B+': 8,
      'B-': 1,
      'AB+': 5,
      'AB-': 0,
      'O+': 15,
      'O-': 3
    },
    medicines: [
      { name: "Insulin", available: true, quantity: 30 },
      { name: "Heparin", available: true, quantity: 20 },
      { name: "Nitroglycerin", available: true, quantity: 15 },
      { name: "Clopidogrel", available: true, quantity: 60 }
    ],
    openStatus: "Open 24/7",
    verificationStatus: "Verified Partner",
    lastUpdated: new Date()
  },
  {
    name: "Fortis Escorts Heart Institute",
    address: "Okhla Road, Opp Holy Family Hospital, New Delhi 110025",
    phone: "+91-11-47135000",
    latitude: 28.5606,
    longitude: 77.2732,
    treatments: ["Cardiology", "General Emergency", "Surgery", "General Medicine"],
    specialists: ["Cardiologist", "Surgeon", "General Physician"],
    emergencyAvailable: true,
    icuAvailable: true,
    icuTotal: 50,
    icuAvailableBeds: 12,
    ambulanceAvailable: true,
    pharmacyAvailable: true,
    bloodAvailability: {
      'A+': 10,
      'A-': 4,
      'B+': 18,
      'B-': 2,
      'AB+': 6,
      'AB-': 2,
      'O+': 24,
      'O-': 6
    },
    medicines: [
      { name: "Insulin", available: true, quantity: 50 },
      { name: "Atorvastatin", available: true, quantity: 80 },
      { name: "Clopidogrel", available: true, quantity: 45 },
      { name: "Dopamine", available: true, quantity: 12 }
    ],
    openStatus: "Open 24/7",
    verificationStatus: "NABH Accredited & Verified",
    lastUpdated: new Date()
  },
  {
    name: "AIIMS Emergency & Trauma Centre",
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029",
    phone: "+91-11-26588500",
    latitude: 28.5672,
    longitude: 77.2100,
    treatments: ["General Emergency", "Trauma", "Surgery", "Neurology", "Orthopedics", "Cardiology", "Pediatrics", "Maternity"],
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Specialist", "Pediatrician", "Surgeon", "Gynecologist", "General Physician"],
    emergencyAvailable: true,
    icuAvailable: true,
    icuTotal: 100,
    icuAvailableBeds: 3,
    ambulanceAvailable: true,
    pharmacyAvailable: true,
    bloodAvailability: {
      'A+': 30,
      'A-': 8,
      'B+': 35,
      'B-': 7,
      'AB+': 15,
      'AB-': 5,
      'O+': 45,
      'O-': 10
    },
    medicines: [
      { name: "Insulin", available: true, quantity: 100 },
      { name: "Remdesivir", available: true, quantity: 30 },
      { name: "Paracetamol IV", available: true, quantity: 200 },
      { name: "Epinephrine", available: true, quantity: 50 }
    ],
    openStatus: "Open 24/7",
    verificationStatus: "Government Verified (Real-time Sync)",
    lastUpdated: new Date()
  },
  {
    name: "Max Super Speciality Hospital Saket",
    address: "1, 2, Press Enclave Marg, Saket Institutional Area, New Delhi 110017",
    phone: "+91-11-26515050",
    latitude: 28.5283,
    longitude: 77.2124,
    treatments: ["Neurology", "Cardiology", "Orthopedics", "Surgery", "Maternity"],
    specialists: ["Neurologist", "Cardiologist", "Gynecologist", "Surgeon"],
    emergencyAvailable: true,
    icuAvailable: true,
    icuTotal: 35,
    icuAvailableBeds: 6,
    ambulanceAvailable: true,
    pharmacyAvailable: true,
    bloodAvailability: {
      'A+': 8,
      'A-': 1,
      'B+': 14,
      'B-': 3,
      'AB+': 4,
      'AB-': 1,
      'O+': 10,
      'O-': 2
    },
    medicines: [
      { name: "Insulin", available: true, quantity: 25 },
      { name: "Remdesivir", available: true, quantity: 15 },
      { name: "Mannitol", available: true, quantity: 20 },
      { name: "Levetiracetam", available: true, quantity: 40 }
    ],
    openStatus: "Open 24/7",
    verificationStatus: "Verified Partner",
    lastUpdated: new Date()
  },
  {
    name: "BLK-Max Super Speciality Hospital",
    address: "Pusa Road, Radha Soami Satsang, Rajinder Nagar, New Delhi 110005",
    phone: "+91-11-30403040",
    latitude: 28.6433,
    longitude: 77.1788,
    treatments: ["Orthopedics", "General Emergency", "Trauma", "Surgery", "General Medicine"],
    specialists: ["Orthopedic Specialist", "Surgeon", "General Physician"],
    emergencyAvailable: true,
    icuAvailable: true,
    icuTotal: 30,
    icuAvailableBeds: 9,
    ambulanceAvailable: true,
    pharmacyAvailable: true,
    bloodAvailability: {
      'A+': 15,
      'A-': 2,
      'B+': 20,
      'B-': 4,
      'AB+': 6,
      'AB-': 1,
      'O+': 0, // Explicitly 0 units to test O+ out-of-stock matching logic
      'O-': 2
    },
    medicines: [
      { name: "Insulin", available: true, quantity: 15 },
      { name: "Ceftriaxone", available: true, quantity: 35 },
      { name: "Diclofenac", available: true, quantity: 60 }
    ],
    openStatus: "Open 24/7",
    verificationStatus: "Verified Partner",
    lastUpdated: new Date()
  },
  {
    name: "Medanta Speciality Care Clinic",
    address: "E-18, Defense Colony, New Delhi 110024",
    phone: "+91-11-41552233",
    latitude: 28.5729,
    longitude: 77.2312,
    treatments: ["Pediatrics", "Maternity", "General Medicine"],
    specialists: ["Pediatrician", "Gynecologist", "General Physician"],
    emergencyAvailable: false,
    icuAvailable: false,
    icuTotal: 0,
    icuAvailableBeds: 0,
    ambulanceAvailable: false,
    pharmacyAvailable: true,
    bloodAvailability: {
      'A+': 5,
      'A-': 0,
      'B+': 6,
      'B-': 0,
      'AB+': 2,
      'AB-': 0,
      'O+': 4,
      'O-': 0
    },
    medicines: [
      { name: "Pediatric Syrups", available: true, quantity: 50 },
      { name: "Insulin", available: true, quantity: 10 },
      { name: "Amoxicillin", available: true, quantity: 40 }
    ],
    openStatus: "Open (8:00 AM - 9:00 PM)",
    verificationStatus: "Verified Partner",
    lastUpdated: new Date()
  },
  {
    name: "Manipal Hospital Dwarka",
    address: "Sector 6, Dwarka, New Delhi, Delhi 110075",
    phone: "+91-11-49674967",
    latitude: 28.5870,
    longitude: 77.0600,
    treatments: ["Orthopedics", "Trauma", "Neurology", "General Emergency"],
    specialists: ["Orthopedic Specialist", "Neurologist", "Surgeon"],
    emergencyAvailable: true,
    icuAvailable: true,
    icuTotal: 25,
    icuAvailableBeds: 7,
    ambulanceAvailable: true,
    pharmacyAvailable: true,
    bloodAvailability: {
      'A+': 8,
      'A-': 1,
      'B+': 10,
      'B-': 2,
      'AB+': 4,
      'AB-': 0,
      'O+': 8,
      'O-': 3
    },
    medicines: [
      { name: "Insulin", available: true, quantity: 20 },
      { name: "Antivenom", available: true, quantity: 5 },
      { name: "Trauma Kits", available: true, quantity: 15 }
    ],
    openStatus: "Open 24/7",
    verificationStatus: "Verified Partner",
    lastUpdated: new Date()
  }
];

module.exports = initialHospitals;
