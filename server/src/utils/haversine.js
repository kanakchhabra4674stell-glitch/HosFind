/**
 * Calculate Great Circle Distance using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 5.0; // default fallback 5km
  }

  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Estimate travel time in minutes based on distance and urban traffic buffer
 * @param {number} distanceKm 
 * @returns {number} Estimated travel time in minutes
 */
function estimateTravelTime(distanceKm) {
  // Average urban speed ~ 22 km/h (~2.7 min per km) + base traffic buffer 3 mins
  const time = Math.round(distanceKm * 2.7 + 3);
  return Math.max(time, 2); // At least 2 mins
}

module.exports = {
  calculateDistance,
  estimateTravelTime
};
