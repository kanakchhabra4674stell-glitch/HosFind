import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Phone, Navigation, ShieldAlert, 
  MapPin, Clock, Heart, Bed, Activity, Loader2, CheckCircle2 
} from 'lucide-react';
import { matchHospitalsAPI } from '../utils/api';

const DEMO_LOCATION = {
  latitude: 28.6139,
  longitude: 77.2090,
  label: 'Delhi NCR (Demo Location)'
};

const EMERGENCY_PRESETS = [
  { id: 'cardiac', label: '🫀 Cardiac / Chest Pain', treatment: 'Cardiology', specialist: 'Cardiologist', icu: true },
  { id: 'trauma', label: '🩸 Trauma / Accident', treatment: 'Trauma', specialist: 'Surgeon', icu: true },
  { id: 'stroke', label: '🧠 Stroke / Neurological', treatment: 'Neurology', specialist: 'Neurologist', icu: true },
  { id: 'peds', label: '👶 Pediatric Emergency', treatment: 'Pediatrics', specialist: 'Pediatrician', icu: false },
  { id: 'maternity', label: '🤰 Maternity / Labor', treatment: 'Maternity', specialist: 'Gynecologist', icu: false },
  { id: 'general', label: '🚨 General Critical', treatment: 'General Emergency', specialist: 'General Physician', icu: true }
];

export default function EmergencyModePage() {
  const [selectedPreset, setSelectedPreset] = useState(EMERGENCY_PRESETS[0]);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [userLocation, setUserLocation] = useState(DEMO_LOCATION);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runEmergencyMatch(selectedPreset, bloodGroup);
  }, [selectedPreset, bloodGroup]);

  const runEmergencyMatch = async (preset, blood) => {
    setIsLoading(true);
    try {
      const requirements = {
        treatment: preset.treatment,
        specialist: preset.specialist,
        emergencyLevel: 'Critical',
        icuRequired: preset.icu,
        bloodGroup: blood,
        resources: ['Emergency', preset.icu ? 'ICU' : null, blood ? 'Blood' : null].filter(Boolean)
      };

      const res = await matchHospitalsAPI(requirements, userLocation);
      if (res && res.data) {
        setHospitals(res.data);
      }
    } catch (err) {
      console.error('Emergency match error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const topHospital = hospitals[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Top Urgent Emergency Bar */}
      <div className="bg-red-600 text-white px-4 py-3 text-center shadow-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 animate-pulse">
        <AlertTriangle className="w-5 h-5 shrink-0" />
        <span>EMERGENCY MODE ACTIVE • FAST ROUTING PROTOCOL</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Warning Banner */}
        <div className="bg-red-950/80 border-2 border-red-600 text-red-200 p-5 rounded-2xl shadow-xl flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-white text-base">LIFE-THREATENING EMERGENCY?</h3>
            <p className="text-xs sm:text-sm text-red-200">
              If this is a critical medical emergency, call local emergency services immediately:
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="tel:102" className="px-4 py-2 bg-red-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-md hover:bg-red-500">
                <Phone className="w-4 h-4" /> Call Ambulance (102 / 108)
              </a>
              <a href="tel:112" className="px-4 py-2 bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 border border-slate-700">
                <Phone className="w-4 h-4" /> Call National Helpline (112)
              </a>
            </div>
          </div>
        </div>

        {/* 1-Tap Emergency Preset Selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Select Emergency Condition:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EMERGENCY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`p-4 rounded-2xl border text-left font-bold text-sm transition ${selectedPreset.id === preset.id ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Blood Group Filter */}
        <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
          <span className="font-bold text-slate-300">Blood Required:</span>
          <div className="flex gap-2 flex-wrap">
            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
              <button
                key={bg}
                onClick={() => setBloodGroup(bg)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${bloodGroup === bg ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Top Recommended Best Hospital Card */}
        {topHospital && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-bl-2xl">
              Top Emergency Match ({topHospital.matchScore}% Score)
            </div>

            <div className="space-y-2">
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                ⚡ Fastest Suitable Emergency Care
              </div>
              <h2 className="text-3xl font-extrabold text-white">{topHospital.hospital.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {topHospital.hospital.address}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Est. ETA</div>
                <div className="text-xl font-black text-amber-400">~{topHospital.travelTimeMin} min</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Distance</div>
                <div className="text-xl font-black text-blue-400">{topHospital.distanceKm} km</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Emergency Dept</div>
                <div className="text-xl font-black text-emerald-400">OPEN 24/7</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">ICU Beds</div>
                <div className="text-xl font-black text-purple-400">{topHospital.hospital.icuAvailableBeds} Free</div>
              </div>
            </div>

            {/* Explanations */}
            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="font-bold text-slate-400 uppercase text-[10px]">Match Justification:</div>
              {topHospital.explanations?.slice(0, 3).map((exp, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{exp}</span>
                </div>
              ))}
            </div>

            {/* Prominent Action Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${topHospital.hospital.latitude},${topHospital.hospital.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-base"
              >
                <Navigation className="w-5 h-5" />
                Navigate to Best Hospital NOW
              </a>

              <a
                href={`tel:${topHospital.hospital.phone}`}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-base"
              >
                <Phone className="w-5 h-5" />
                Call ER Desk ({topHospital.hospital.phone})
              </a>
            </div>
          </div>
        )}

        {/* Other Suitable Hospitals List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Other Suitable Emergency Hospitals:</h3>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
              Scanning emergency ready hospitals...
            </div>
          ) : (
            <div className="space-y-4">
              {hospitals.slice(1, 4).map((matchData) => (
                <div key={matchData.hospital._id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {matchData.matchScore}% Match
                      </span>
                      <span className="text-xs text-slate-400">~{matchData.travelTimeMin} min ({matchData.distanceKm} km)</span>
                    </div>
                    <h4 className="font-bold text-white text-base">{matchData.hospital.name}</h4>
                    <p className="text-xs text-slate-400">{matchData.hospital.address}</p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${matchData.hospital.latitude},${matchData.hospital.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 border border-slate-700 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Navigate
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
