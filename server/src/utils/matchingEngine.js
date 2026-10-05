const { calculateDistance, estimateTravelTime } = require('./haversine');

/**
 * Smart Hospital Matching Engine
 * Calculates weighted match score out of 100 based on exact project criteria.
 */
function matchHospital(hospital, requirement, userLat, userLng) {
  // 1. Calculate Distance & Travel Time
  const distanceKm = calculateDistance(userLat, userLng, hospital.latitude, hospital.longitude);
  const travelTimeMin = estimateTravelTime(distanceKm);

  // 2. Treatment Score (Weight: 30%)
  let treatmentScore = 0;
  let treatmentExplanation = '';
  const reqTreatment = requirement.treatment || 'General Emergency';

  const matchesTreatment = hospital.treatments && hospital.treatments.some(
    t => t.toLowerCase() === reqTreatment.toLowerCase()
  );

  if (matchesTreatment) {
    treatmentScore = 30;
    treatmentExplanation = `✓ Treatment matches your requirement (${reqTreatment})`;
  } else if (reqTreatment === 'General Emergency' && hospital.emergencyAvailable) {
    treatmentScore = 30;
    treatmentExplanation = `✓ Emergency department ready for general treatment`;
  } else if (hospital.treatments && hospital.treatments.includes('General Medicine')) {
    treatmentScore = 15;
    treatmentExplanation = `~ Offers General Medicine (partial match for ${reqTreatment})`;
  } else {
    treatmentScore = 0;
    treatmentExplanation = `✗ Requested treatment (${reqTreatment}) not explicitly listed`;
  }

  // 3. Specialist Score (Weight: 20%)
  let specialistScore = 0;
  let specialistExplanation = '';
  const reqSpecialist = requirement.specialist || 'General Physician';

  const matchesSpecialist = hospital.specialists && hospital.specialists.some(
    s => s.toLowerCase() === reqSpecialist.toLowerCase()
  );

  if (matchesSpecialist) {
    specialistScore = 20;
    specialistExplanation = `✓ ${reqSpecialist} available on duty`;
  } else if (hospital.specialists && hospital.specialists.includes('General Physician')) {
    specialistScore = 10;
    specialistExplanation = `~ General Physician available (specialist ${reqSpecialist} not listed)`;
  } else {
    specialistScore = 0;
    specialistExplanation = `✗ Requested specialist (${reqSpecialist}) unavailable`;
  }

  // 4. Capacity Score (Weight: 15%)
  let capacityScore = 0;
  let capacityExplanation = '';

  const emergencyComponent = hospital.emergencyAvailable ? 7.5 : 0;
  let icuComponent = 0;

  if (requirement.icuRequired) {
    if (hospital.icuAvailable && hospital.icuAvailableBeds > 0) {
      icuComponent = 7.5;
      capacityExplanation = `✓ ICU beds available (${hospital.icuAvailableBeds}/${hospital.icuTotal} beds free)`;
    } else if (hospital.icuAvailable) {
      icuComponent = 3;
      capacityExplanation = `~ ICU unit present but beds at full capacity`;
    } else {
      icuComponent = 0;
      capacityExplanation = `✗ ICU facility not available`;
    }
  } else {
    icuComponent = hospital.icuAvailable ? 7.5 : 5;
    capacityExplanation = hospital.emergencyAvailable ? `✓ Emergency capacity available` : `~ Limited emergency capacity`;
  }

  capacityScore = emergencyComponent + icuComponent;

  // 5. Blood / Medicine Score (Weight: 15%)
  let bloodMedicineScore = 0;
  let bloodMedicineExplanation = '';

  if (requirement.bloodGroup) {
    const units = (hospital.bloodAvailability && hospital.bloodAvailability[requirement.bloodGroup]) || 0;
    if (units > 0) {
      bloodMedicineScore = 15;
      bloodMedicineExplanation = `✓ Required blood group (${requirement.bloodGroup}) in stock (${units} units)`;
    } else {
      bloodMedicineScore = 0;
      bloodMedicineExplanation = `✗ Required blood group (${requirement.bloodGroup}) currently OUT OF STOCK`;
    }
  } else if (requirement.medicineRequired) {
    if (hospital.pharmacyAvailable) {
      bloodMedicineScore = 15;
      bloodMedicineExplanation = `✓ 24/7 Pharmacy available with essential medicines`;
    } else {
      bloodMedicineScore = 0;
      bloodMedicineExplanation = `✗ Pharmacy unavailable`;
    }
  } else {
    if (hospital.pharmacyAvailable) {
      bloodMedicineScore = 15;
      bloodMedicineExplanation = `✓ On-site pharmacy and blood bank support available`;
    } else {
      bloodMedicineScore = 7.5;
      bloodMedicineExplanation = `~ Basic pharmacy support`;
    }
  }

  // 6. Travel Time Score (Weight: 10%)
  let travelScore = 0;
  if (travelTimeMin <= 10) travelScore = 10;
  else if (travelTimeMin <= 20) travelScore = 8;
  else if (travelTimeMin <= 35) travelScore = 5;
  else travelScore = 2;

  const travelExplanation = `Estimated travel time: ~${travelTimeMin} mins (${travelScore}/10 pts)`;

  // 7. Distance Score (Weight: 10%)
  let distanceScore = 0;
  if (distanceKm <= 3) distanceScore = 10;
  else if (distanceKm <= 7) distanceScore = 8;
  else if (distanceKm <= 15) distanceScore = 5;
  else distanceScore = 2;

  const distanceExplanation = `Proximity: ${distanceKm} km away (${distanceScore}/10 pts)`;

  // Total Score Calculation
  const matchScore = Math.min(100, Math.round(
    treatmentScore +
    specialistScore +
    capacityScore +
    bloodMedicineScore +
    travelScore +
    distanceScore
  ));

  // Build Explanations List
  const explanationList = [
    treatmentExplanation,
    specialistExplanation,
    capacityExplanation,
    bloodMedicineExplanation,
    travelExplanation,
    distanceExplanation
  ];

  return {
    hospital,
    matchScore,
    distanceKm,
    travelTimeMin,
    breakdown: {
      treatmentScore: Math.round(treatmentScore),
      specialistScore: Math.round(specialistScore),
      capacityScore: Math.round(capacityScore),
      bloodMedicineScore: Math.round(bloodMedicineScore),
      travelScore: Math.round(travelScore),
      distanceScore: Math.round(distanceScore)
    },
    explanations: explanationList
  };
}

module.exports = {
  matchHospital
};
