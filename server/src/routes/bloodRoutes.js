const express = require('express');
const router = express.Router();
const { getBloodInventory } = require('../db');
const { calculateDistance } = require('../utils/haversine');

// Default location if none provided
const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.2090;

/**
 * GET /api/blood
 * Query parameters: group (e.g. O+, A-), lat, lng
 */
router.get('/blood', async (req, res) => {
  try {
    const { group, lat, lng } = req.query;
    const userLat = Number(lat) || DEFAULT_LAT;
    const userLng = Number(lng) || DEFAULT_LNG;

    const inventory = await getBloodInventory(group);

    // Calculate proximity for each item
    const results = inventory.map(item => {
      const distanceKm = calculateDistance(userLat, userLng, item.latitude, item.longitude);
      return {
        ...item,
        distanceKm,
        travelTimeMin: Math.round(distanceKm * 2.7 + 3)
      };
    });

    // Sort by units available (descending) and distance (ascending)
    results.sort((a, b) => {
      if (b.units !== a.units) return b.units - a.units;
      return a.distanceKm - b.distanceKm;
    });

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
