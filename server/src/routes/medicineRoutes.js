const express = require('express');
const router = express.Router();
const { getMedicineInventory } = require('../db');
const { calculateDistance } = require('../utils/haversine');

const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.2090;

/**
 * GET /api/medicines
 * Query parameters: name or search, lat, lng
 */
router.get('/medicines', async (req, res) => {
  try {
    const searchName = req.query.name || req.query.search || '';
    const userLat = Number(req.query.lat) || DEFAULT_LAT;
    const userLng = Number(req.query.lng) || DEFAULT_LNG;

    const inventory = await getMedicineInventory(searchName);

    const results = inventory.map(item => {
      const distanceKm = calculateDistance(userLat, userLng, item.latitude, item.longitude);
      return {
        ...item,
        distanceKm,
        travelTimeMin: Math.round(distanceKm * 2.7 + 3)
      };
    });

    results.sort((a, b) => {
      if (b.available !== a.available) return (b.available ? 1 : 0) - (a.available ? 1 : 0);
      if (b.quantity !== a.quantity) return b.quantity - a.quantity;
      return a.distanceKm - b.distanceKm;
    });

    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
