import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, MapPin, AlertCircle, Edit2, Check, RefreshCw, 
  Sparkles, Filter, Activity, Bed, Droplet, Stethoscope, Loader2, Navigation 
} from 'lucide-react';
import { extractRequirementsAPI, matchHospitalsAPI } from '../utils/api';
import HospitalCard from '../components/HospitalCard';
import DisclaimerBanner from '../components/DisclaimerBanner';

// Default Demo Location (Connaught Place, New Delhi)
const DEMO_LOCATION = {
  latitude: 28.6139,
  longitude: 77.2090,
  label: 'Delhi NCR (Demo Location)'
};

export default function FindHospitalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Natural Language Input State
  const [queryText, setQueryText] = useState(
    searchParams.get('q') || "I need a cardiologist urgently. My father has severe chest pain and we may need ICU support. Blood group is O+."
  );

  // Structured Requirement State
  const [requirements, setRequirements] = useState({
    treatment: 'Cardiology',
    specialist: 'Cardiologist',
    emergencyLevel: 'Urgent',
    icuRequired: true,
    bloodGroup: 'O+',
    medicineRequired: false,
    resources: ['ICU', 'Emergency', 'Blood']
  });

  const [isEditingReqs, setIsEditingReqs] = useState(false);

  // Location State
  const [userLocation, setUserLocation] = useState(DEMO_LOCATION);
  const [locationStatus, setLocationStatus] = useState('Demo Location Active');
  const [isLocating, setIsLocating] = useState(false);

  // Results & Loading State
  const [hospitals, setHospitals] = useState([]);
  const [loadingText, setLoadingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-run initial match on component mount
  useEffect(() => {
    handleExtractAndMatch(queryText);
  }, []);

  // Browser Geolocation Handler
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser. Using demo location.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring browser location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: 'Live Browser Location'
        };
        setUserLocation(coords);
        setLocationStatus('Using Live Location');
        setIsLocating(false);
        // Re-run matching with new location
        runMatching(requirements, coords);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLocationStatus('Location unavailable. Continuing with demo location.');
        setUserLocation(DEMO_LOCATION);
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleUseDemoLocation = () => {
    setUserLocation(DEMO_LOCATION);
    setLocationStatus('Demo Location Active (Delhi NCR)');
    runMatching(requirements, DEMO_LOCATION);
  };

  // Main Extract & Match Handler
  const handleExtractAndMatch = async (textToProcess) => {
    const text = textToProcess || queryText;
    if (!text || text.trim() === '') return;

    setIsLoading(true);
    setErrorMsg('');
    setLoadingText('Understanding your medical requirement...');

    try {
      // 1. AI Requirement Extraction
      const extractRes = await extractRequirementsAPI(text);
      if (extractRes && extractRes.data) {
        setRequirements(extractRes.data);
        
        setLoadingText('Finding suitable hospitals & calculating smart matches...');
        
        // 2. Smart Hospital Matching
        await runMatching(extractRes.data, userLocation);
      }
    } catch (err) {
      console.error('Error during extraction/matching:', err);
      setErrorMsg('Server communication error. Utilizing client matching fallback.');
      setIsLoading(false);
    }
  };

  const runMatching = async (reqs, location) => {
    setIsLoading(true);
    setLoadingText('Calculating match scores...');
    try {
      const matchRes = await matchHospitalsAPI(reqs, location);
      if (matchRes && matchRes.data) {
        setHospitals(matchRes.data);
        setHasSearched(true);
      }
    } catch (err) {
      setErrorMsg('Failed to fetch hospital matches. Ensure backend server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  // Manual filter change handler
  const handleFilterChange = (field, value) => {
    const updated = { ...requirements, [field]: value };
    setRequirements(updated);
  };

  const handleResourceToggle = (resource) => {
    const current = requirements.resources || [];
    const updated = current.includes(resource)
      ? current.filter(r => r !== resource)
      : [...current, resource];
    
    const isIcu = updated.includes('ICU');
    setRequirements({ ...requirements, resources: updated, icuRequired: isIcu });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400" />
            AI Requirements Router
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            What medical help do you need?
          </h1>

          <p className="text-slate-300 text-sm sm:text-base">
            Describe your condition in natural language. Our weighted matching engine will identify hospitals with available specialists, ICU beds, blood stock, and shortest travel time.
          </p>

          {/* Natural Language Input Form */}
          <div className="space-y-3 pt-2">
            <div className="relative">
              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="I need a cardiologist urgently. My father has severe chest pain and we may need ICU support."
                rows={3}
                className="w-full p-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-base shadow-inner resize-none font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleExtractAndMatch(queryText)}
                disabled={isLoading}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Find Suitable Hospitals
              </button>

              <button
                onClick={() => navigate('/emergency')}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition flex items-center gap-2 text-sm"
              >
                <AlertCircle className="w-5 h-5" />
                Emergency Mode
              </button>
            </div>

            {/* Quick Demo Presets */}
            <div className="pt-2 flex items-center gap-2 flex-wrap text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Try Demo Presets:</span>
              
              <button
                onClick={() => {
                  const text = "I need a cardiologist urgently. My father has severe chest pain and we may need ICU support. Blood group is O+.";
                  setQueryText(text);
                  handleExtractAndMatch(text);
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/10"
              >
                🫀 Chest Pain / Cardiologist + O+
              </button>

              <button
                onClick={() => {
                  const text = "My child has high fever and breathing difficulty. Need a pediatrician urgently.";
                  setQueryText(text);
                  handleExtractAndMatch(text);
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/10"
              >
                👶 Child High Fever / Pediatrician
              </button>

              <button
                onClick={() => {
                  const text = "Severe leg fracture from accident, need orthopedic specialist and ambulance.";
                  setQueryText(text);
                  handleExtractAndMatch(text);
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition border border-white/10"
              >
                🦴 Bone Fracture / Orthopedic
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Main Grid: Filters & AI Extraction (Left) + Ranked Hospitals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Location & Structured Requirement Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Location Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Patient Location
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-800">{userLocation.label}</div>
              <div className="text-slate-500 font-mono">
                Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
              </div>
              <div className="text-blue-600 font-medium pt-1">{locationStatus}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs transition border border-blue-200 flex items-center justify-center gap-1"
              >
                {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                Use My Location
              </button>

              <button
                onClick={handleUseDemoLocation}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition border border-slate-300"
              >
                Use Demo Location
              </button>
            </div>
          </div>

          {/* AI Requirement Understanding Chips Card (Section 6) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Requirement Understanding
              </h3>

              <button
                onClick={() => setIsEditingReqs(!isEditingReqs)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {isEditingReqs ? 'Done Editing' : 'Edit Requirements'}
              </button>
            </div>

            {/* Structured Requirement Chips */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                  Treatment: <strong>{requirements.treatment}</strong>
                </span>

                <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                  Specialist: <strong>{requirements.specialist}</strong>
                </span>

                <span className={`px-3 py-1.5 rounded-xl border font-semibold ${requirements.emergencyLevel === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  Emergency: <strong>{requirements.emergencyLevel}</strong>
                </span>

                <span className={`px-3 py-1.5 rounded-xl border font-semibold ${requirements.icuRequired ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  ICU: <strong>{requirements.icuRequired ? 'Required' : 'Not Required'}</strong>
                </span>

                {requirements.bloodGroup && (
                  <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                    Blood: <strong>{requirements.bloodGroup}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Manual Filters Controls (Collapsible or editable) */}
            <div className={`pt-4 border-t border-slate-200 space-y-4 ${isEditingReqs ? 'block' : 'hidden'}`}>
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fine-Tune Requirements</div>
              
              {/* Treatment Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Treatment Required</label>
                <select
                  value={requirements.treatment}
                  onChange={(e) => handleFilterChange('treatment', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Maternity">Maternity</option>
                  <option value="General Emergency">General Emergency</option>
                  <option value="General Medicine">General Medicine</option>
                </select>
              </div>

              {/* Specialist Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Specialist Required</label>
                <select
                  value={requirements.specialist}
                  onChange={(e) => handleFilterChange('specialist', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Orthopedic Specialist">Orthopedic Specialist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Surgeon">Surgeon</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="General Physician">General Physician</option>
                </select>
              </div>

              {/* Emergency Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Emergency Level</label>
                <select
                  value={requirements.emergencyLevel}
                  onChange={(e) => handleFilterChange('emergencyLevel', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Group</label>
                <select
                  value={requirements.bloodGroup || ''}
                  onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="">None Specified</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Resources Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Required Resources</label>
                <div className="space-y-1.5 text-xs">
                  {['ICU', 'Emergency', 'Blood', 'Pharmacy', 'Ambulance'].map((res) => (
                    <label key={res} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(requirements.resources || []).includes(res)}
                        onChange={() => handleResourceToggle(res)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{res}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => runMatching(requirements, userLocation)}
                className="w-full py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition"
              >
                Re-calculate Match Scores
              </button>

            </div>

          </div>

          <DisclaimerBanner compact={true} />

        </div>

        {/* Right Column: Ranked Hospital Results (Sections 7 & 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Hospitals that match your requirement
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ranked by 6-factor weighted score (Treatment 30%, Specialist 20%, Capacity 15%, Inventory 15%, Travel 10%, Distance 10%)
              </p>
            </div>

            <button
              onClick={() => runMatching(requirements, userLocation)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
              <div className="text-base font-bold text-slate-800">{loadingText}</div>
              <p className="text-xs text-slate-500">Evaluating bed availability, specialist on-duty status, and traffic travel times...</p>
            </div>
          )}

          {/* Error State */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Results List */}
          {!isLoading && hasSearched && (
            <div className="space-y-6">
              {hospitals.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3">
                  <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-800">No Hospitals Found</h3>
                  <p className="text-xs text-slate-500">Try adjusting your filters or broadening your search criteria.</p>
                </div>
              ) : (
                hospitals.map((matchData) => (
                  <HospitalCard
                    key={matchData.hospital._id}
                    matchData={matchData}
                    userLocation={userLocation}
                  />
                ))
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
