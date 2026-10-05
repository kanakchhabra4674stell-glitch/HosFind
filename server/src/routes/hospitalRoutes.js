const express = require('express');
const router = express.Router();
const { 
  getAllHospitals, 
  getHospitalById, 
  createHospital, 
  updateHospital 
} = require('../db');
const { matchHospital } = require('../utils/matchingEngine');

// Default Demo Location (Connaught Place, New Delhi) if location not provided
const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.2090;

/**
 * GET /api/hospitals
 * Fetch all hospitals
 */
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await getAllHospitals();
    res.json({ success: true, data: hospitals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/hospitals/:id
 * Fetch single hospital details
 */
router.get('/hospitals/:id', async (req, res) => {
  try {
    const hospital = await getHospitalById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    res.json({ success: true, data: hospital });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/hospitals
 * Create hospital entry
 */
router.post('/hospitals', async (req, res) => {
  try {
    const created = await createHospital(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/hospitals/:id
 * Update hospital information
 */
router.put('/hospitals/:id', async (req, res) => {
  try {
    const updated = await updateHospital(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * PUT /api/hospitals/:id/availability
 * Update hospital capacity, blood, and medicine inventory from staff dashboard
 */
router.put('/hospitals/:id/availability', async (req, res) => {
  try {
    const hospitalId = req.params.id;
    const { 
      name, address, phone, latitude, longitude,
      treatments, specialists, emergencyAvailable, 
      icuAvailable, icuTotal, icuAvailableBeds, 
      ambulanceAvailable, pharmacyAvailable, 
      bloodAvailability, medicines, openStatus, verificationStatus 
    } = req.body;

    const existing = await getHospitalById(hospitalId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }

    const payload = {
      ...existing,
      name: name !== undefined ? name : existing.name,
      address: address !== undefined ? address : existing.address,
      phone: phone !== undefined ? phone : existing.phone,
      latitude: latitude !== undefined ? Number(latitude) : existing.latitude,
      longitude: longitude !== undefined ? Number(longitude) : existing.longitude,
      treatments: treatments !== undefined ? treatments : existing.treatments,
      specialists: specialists !== undefined ? specialists : existing.specialists,
      emergencyAvailable: emergencyAvailable !== undefined ? Boolean(emergencyAvailable) : existing.emergencyAvailable,
      icuAvailable: icuAvailable !== undefined ? Boolean(icuAvailable) : existing.icuAvailable,
      icuTotal: icuTotal !== undefined ? Number(icuTotal) : existing.icuTotal,
      icuAvailableBeds: icuAvailableBeds !== undefined ? Number(icuAvailableBeds) : existing.icuAvailableBeds,
      ambulanceAvailable: ambulanceAvailable !== undefined ? Boolean(ambulanceAvailable) : existing.ambulanceAvailable,
      pharmacyAvailable: pharmacyAvailable !== undefined ? Boolean(pharmacyAvailable) : existing.pharmacyAvailable,
      bloodAvailability: bloodAvailability !== undefined ? bloodAvailability : existing.bloodAvailability,
      medicines: medicines !== undefined ? medicines : existing.medicines,
      openStatus: openStatus !== undefined ? openStatus : existing.openStatus,
      verificationStatus: verificationStatus !== undefined ? verificationStatus : existing.verificationStatus,
      lastUpdated: new Date()
    };

    const updated = await updateHospital(hospitalId, payload);
    res.json({ success: true, data: updated, message: 'Hospital availability updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/match-hospitals
 * Main smart matching endpoint!
 * Accepts structured requirements + user coordinates, returns hospitals sorted by match score.
 */
router.post('/match-hospitals', async (req, res) => {
  try {
    const { requirements = {}, userLocation = {} } = req.body;

    const userLat = Number(userLocation.latitude) || DEFAULT_LAT;
    const userLng = Number(userLocation.longitude) || DEFAULT_LNG;

    const allHospitals = await getAllHospitals();

    // Calculate match score for every hospital
    const rankedHospitals = allHospitals.map(hospital => {
      return matchHospital(hospital, requirements, userLat, userLng);
    });

    // Sort hospitals by matchScore descending. If matchScores are equal, sort by distanceKm ascending.
    rankedHospitals.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.distanceKm - b.distanceKm;
    });

    res.json({
      success: true,
      userLocation: { latitude: userLat, longitude: userLng },
      requirements,
      totalHospitalsEvaluated: allHospitals.length,
      data: rankedHospitals
    });
  } catch (err) {
    console.error('Error matching hospitals:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
