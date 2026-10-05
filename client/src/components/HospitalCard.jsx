import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Clock, Phone, Navigation, HelpCircle, 
  CheckCircle, XCircle, AlertCircle, ShieldCheck, 
  Bed, Droplet, Stethoscope, Activity, Pill
} from 'lucide-react';
import ExplainableModal from './ExplainableModal';

export default function HospitalCard({ matchData, userLocation }) {
  const [showModal, setShowModal] = useState(false);

  if (!matchData) return null;

  const { hospital, matchScore, distanceKm, travelTimeMin } = matchData;

  const userLat = userLocation?.latitude || 28.6139;
  const userLng = userLocation?.longitude || 77.2090;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${hospital.latitude},${hospital.longitude}`;

  const getScoreBadgeClass = (score) => {
    if (score >= 85) return 'bg-emerald-600 text-white border-emerald-700';
    if (score >= 70) return 'bg-blue-600 text-white border-blue-700';
    if (score >= 50) return 'bg-amber-500 text-white border-amber-600';
    return 'bg-slate-600 text-white border-slate-700';
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
        <div>
          {/* Top Header Banner */}
          <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {hospital.verificationStatus || 'Verified Partner'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Updated {hospital.lastUpdated ? new Date(hospital.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                {hospital.name}
              </h3>
              
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {hospital.address}
              </p>
            </div>

            {/* Match Score Badge */}
            <div className="flex flex-col items-end shrink-0">
              <div className={`px-3.5 py-1.5 rounded-xl font-extrabold text-base tracking-tight shadow-sm border flex items-center gap-1.5 ${getScoreBadgeClass(matchScore)}`}>
                <Activity className="w-4 h-4" />
                {matchScore}% Match
              </div>
              
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 underline underline-offset-2"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Why this hospital?
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="px-5 py-3 bg-blue-50/50 border-b border-slate-100 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Distance: <strong>{distanceKm} km</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Est. Travel Time: <strong>~{travelTimeMin} min</strong></span>
            </div>
          </div>

          {/* Key Capabilities Badges */}
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              
              {/* Emergency */}
              <div className={`flex items-center gap-1.5 p-2 rounded-lg border ${hospital.emergencyAvailable ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'}`}>
                {hospital.emergencyAvailable ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                <span className="font-semibold">{hospital.emergencyAvailable ? 'Emergency Ready' : 'Emergency Closed'}</span>
              </div>

              {/* ICU */}
              <div className={`flex items-center gap-1.5 p-2 rounded-lg border ${hospital.icuAvailable && hospital.icuAvailableBeds > 0 ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-amber-50 text-amber-900 border-amber-200'}`}>
                <Bed className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="font-semibold">
                  {hospital.icuAvailable ? `ICU (${hospital.icuAvailableBeds}/${hospital.icuTotal} Beds)` : 'ICU Unavailable'}
                </span>
              </div>

            </div>

            {/* Treatments & Specialists */}
            <div className="text-xs space-y-1.5 pt-1">
              <div className="flex items-start gap-1.5 text-slate-600">
                <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Specialists:</span>{' '}
                  {hospital.specialists?.slice(0, 3).join(', ')}
                  {hospital.specialists?.length > 3 && ` +${hospital.specialists.length - 3} more`}
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-slate-600">
                <Pill className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Key Treatments:</span>{' '}
                  {hospital.treatments?.slice(0, 3).join(', ')}
                </div>
              </div>
            </div>

            {/* Why This Hospital Highlights */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Why this hospital?
              </span>
              <ul className="space-y-1 text-xs text-slate-700">
                {matchData.explanations?.slice(0, 4).map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold shrink-0">•</span>
                    <span className="line-clamp-1">{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
          
          <Link
            to={`/hospital/${hospital._id}`}
            className="px-3 py-2 bg-white text-slate-700 border border-slate-300 font-semibold rounded-xl hover:bg-slate-100 transition text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            View Details
          </Link>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            Navigate
          </a>

          <a
            href={`tel:${hospital.phone}`}
            className="px-3 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition text-xs flex items-center justify-center gap-1 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>

        </div>
      </div>

      {/* Explainable Modal */}
      <ExplainableModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        matchData={matchData}
      />
    </>
  );
}
