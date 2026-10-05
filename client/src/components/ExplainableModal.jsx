import React from 'react';
import { X, CheckCircle2, Clock, MapPin, Award, Activity, Heart, Shield } from 'lucide-react';

export default function ExplainableModal({ isOpen, onClose, matchData }) {
  if (!isOpen || !matchData) return null;

  const { hospital, matchScore, distanceKm, travelTimeMin, breakdown, explanations } = matchData;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              AI Smart Match Explanation
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white">{hospital?.name}</h3>
          <p className="text-sm text-slate-300 mt-1">{hospital?.address}</p>
        </div>

        {/* Score Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">Overall Match Score</div>
            <div className="text-4xl font-extrabold text-slate-900 flex items-baseline gap-2">
              {matchScore}<span className="text-xl text-slate-500 font-semibold">/ 100</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Calculated via 6-factor weighted clinical routing algorithm</p>
          </div>

          <div className={`px-4 py-3 rounded-xl border font-bold text-center ${getScoreColor(matchScore)}`}>
            <div className="text-sm uppercase tracking-wide">Compatibility Rating</div>
            <div className="text-lg">
              {matchScore >= 80 ? 'Highly Recommended' : matchScore >= 60 ? 'Suitable Match' : 'Partial Match'}
            </div>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Weighted Criteria Breakdown
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Treatment */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                  <span className="text-slate-700">Treatment Compatibility</span>
                  <span className="text-blue-600">{breakdown?.treatmentScore} / 30 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(breakdown?.treatmentScore / 30) * 100}%` }}></div>
                </div>
              </div>

              {/* Specialist */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                  <span className="text-slate-700">Specialist Availability</span>
                  <span className="text-blue-600">{breakdown?.specialistScore} / 20 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(breakdown?.specialistScore / 20) * 100}%` }}></div>
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                  <span className="text-slate-700">ICU & Emergency Capacity</span>
                  <span className="text-emerald-600">{breakdown?.capacityScore} / 15 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(breakdown?.capacityScore / 15) * 100}%` }}></div>
                </div>
              </div>

              {/* Blood & Medicine */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                  <span className="text-slate-700">Blood & Medicine Availability</span>
                  <span className="text-rose-600">{breakdown?.bloodMedicineScore} / 15 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(breakdown?.bloodMedicineScore / 15) * 100}%` }}></div>
                </div>
              </div>

              {/* Travel Time */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                  <span className="text-slate-700">Travel Time (~{travelTimeMin} min)</span>
                  <span className="text-amber-600">{breakdown?.travelScore} / 10 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(breakdown?.travelScore / 10) * 100}%` }}></div>
                </div>
              </div>

              {/* Distance */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center text-sm font-semibold mb-1">
                  <span className="text-slate-700">Distance ({distanceKm} km)</span>
                  <span className="text-purple-600">{breakdown?.distanceScore} / 10 pts</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(breakdown?.distanceScore / 10) * 100}%` }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Detailed Explanations */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Human-Readable Reasoning
            </h4>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              {explanations && explanations.map((expl, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span>{expl}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 transition text-sm"
          >
            Close Explanation
          </button>
        </div>

      </div>
    </div>
  );
}
