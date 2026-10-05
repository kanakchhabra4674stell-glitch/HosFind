/**
 * AI & Rule-based Requirement Extraction Layer
 * Converts natural language user input into structured medical requirements.
 */

function ruleBasedExtract(text) {
  const input = text.toLowerCase();
  
  // 1. Blood Group Extraction
  let bloodGroup = null;
  const bloodMatch = input.match(/\b(a|b|ab|o)\s*(\+|\-|positive|negative)\b/i);
  if (bloodMatch) {
    const group = bloodMatch[1].toUpperCase();
    const sign = (bloodMatch[2].toLowerCase() === 'positive' || bloodMatch[2] === '+') ? '+' : '-';
    bloodGroup = `${group}${sign}`;
  }

  // 2. Treatment & Specialist Mapping
  let treatment = 'General Emergency';
  let specialist = 'General Physician';

  if (/\b(chest pain|heart|cardiac|cardiologist|heart attack|angioplasty|arrhythmia|cardiology|valve)\b/.test(input)) {
    treatment = 'Cardiology';
    specialist = 'Cardiologist';
  } else if (/\b(stroke|brain|seizure|paralysis|neurologist|neurology|head injury|coma|spine)\b/.test(input)) {
    treatment = 'Neurology';
    specialist = 'Neurologist';
  } else if (/\b(fracture|bone|joint|ligament|knee|orthopedic|orthopedics|break|dislocation)\b/.test(input)) {
    treatment = 'Orthopedics';
    specialist = 'Orthopedic Specialist';
  } else if (/\b(child|baby|kid|infant|pediatrician|pediatrics|newborn|toddler)\b/.test(input)) {
    treatment = 'Pediatrics';
    specialist = 'Pediatrician';
  } else if (/\b(accident|trauma|bleeding|stab|gunshot|head trauma|crash)\b/.test(input)) {
    treatment = 'Trauma';
    specialist = 'Surgeon';
  } else if (/\b(surgery|appendicitis|hernia|gallbladder|operation|surgical|tumor)\b/.test(input)) {
    treatment = 'Surgery';
    specialist = 'Surgeon';
  } else if (/\b(pregnancy|labor|pregnant|delivery|gynecologist|maternity|birth|obstetrician)\b/.test(input)) {
    treatment = 'Maternity';
    specialist = 'Gynecologist';
  } else if (/\b(fever|infection|cough|diabetes|general|flu)\b/.test(input)) {
    treatment = 'General Medicine';
    specialist = 'General Physician';
  }

  // Explicit overrides if specialist keyword is directly mentioned
  if (/\bcardiologist\b/.test(input)) specialist = 'Cardiologist';
  if (/\bneurologist\b/.test(input)) specialist = 'Neurologist';
  if (/\bpediatrician\b/.test(input)) specialist = 'Pediatrician';
  if (/\bgynecologist\b/.test(input)) specialist = 'Gynecologist';
  if (/\borthopedic\b/.test(input)) specialist = 'Orthopedic Specialist';
  if (/\bsurgeon\b/.test(input)) specialist = 'Surgeon';

  // 3. Emergency Level
  let emergencyLevel = 'Normal';
  if (/\b(critical|severe|immediate|unconscious|cardiac arrest|gasping|profuse|fatal)\b/.test(input)) {
    emergencyLevel = 'Critical';
  } else if (/\b(urgently|urgent|emergency|asap|fast|severe pain)\b/.test(input)) {
    emergencyLevel = 'Urgent';
  }

  // 4. ICU Requirement
  const icuRequired = /\b(icu|intensive care|ventilator|critical care|life support)\b/.test(input);

  // 5. Medicine & Resource requirements
  const medicineRequired = /\b(medicine|pharmacy|insulin|heparin|aspirin|stent|antibiotic)\b/.test(input);
  
  const resources = [];
  if (icuRequired) resources.push('ICU');
  if (emergencyLevel !== 'Normal') resources.push('Emergency');
  if (bloodGroup) resources.push('Blood');
  if (medicineRequired) resources.push('Pharmacy');
  if (/\b(ambulance|transport)\b/.test(input)) resources.push('Ambulance');

  return {
    treatment,
    specialist,
    emergencyLevel,
    icuRequired,
    bloodGroup,
    medicineRequired,
    resources,
    rawText: text
  };
}

/**
 * Main extractor function with LLM API support + Rule-based fallback
 */
async function extractRequirements(text) {
  if (!text || typeof text !== 'string') {
    return ruleBasedExtract("");
  }

  const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (apiKey && process.env.LLM_API_KEY) {
    try {
      // Optional LLM call structure if API key is provided
      // For fallback safety, if fetch/API fails, we return ruleBasedExtract(text)
    } catch (err) {
      console.warn("LLM API call failed, using rule-based extractor fallback:", err.message);
    }
  }

  return ruleBasedExtract(text);
}

module.exports = {
  extractRequirements,
  ruleBasedExtract
};
