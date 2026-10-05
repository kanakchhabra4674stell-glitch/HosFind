const express = require('express');
const router = express.Router();
const { extractRequirements } = require('../utils/extractor');

/**
 * POST /api/extract-requirements
 * Extracts structured JSON medical requirements from natural language input
 */
router.post('/extract-requirements', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Please provide natural language input text.'
      });
    }

    const requirements = await extractRequirements(text);

    return res.json({
      success: true,
      data: requirements
    });
  } catch (err) {
    console.error('Error in /api/extract-requirements:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to extract requirements: ' + err.message
    });
  }
});

module.exports = router;
