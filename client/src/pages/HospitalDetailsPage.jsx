import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Phone, Clock, ShieldCheck, 
  Navigation, Bed, Droplet, Stethoscope, Activity, 
  Pill, AlertCircle, ArrowLeft, Loader2, Truck
} from 'lucide-react';
import { getHospitalByIdAPI } from '../utils/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function HospitalDetailsPage() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchHospital();
  }, [id]);

  const fetchHospital = async () => {
    setIsLoading(true);
    try {
      const res = await getHospitalByIdAPI(id);
      if (res && res.data) {
        setHospital(res.data);
      } else {
        setErrorMsg('Hospital record not found.');
      }
    } catch (err) {
      setErrorMsg('Failed to load hospital details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
        <p className="text-slate-600 font-medium text-sm">Loading hospital profile...</p>
      </div>
    );
  }

  if (errorMsg || !hospital) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">{errorMsg || 'Hospital not found'}</h2>
        <Link to="/find-hospital" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold inline-block">
          Return to Hospital Finder
        </Link>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Button */}
      <Link 
        to="/find-hospital"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Results
      </Link>

      {/* Hospital Profile Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {hospital.verificationStatus || 'Verified Partner'}
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {hospital.openStatus || 'Open 24/7'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {hospital.name}
            </h1>

            <div className="text-slate-300 text-sm space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{hospital.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono">{hospital.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Last Updated: {hospital.lastUpdated ? new Date(hospital.lastUpdated).toLocaleString() : 'Recently'}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <Navigation className="w-4 h-4" />
              Navigate to Hospital
            </a>

            <a
              href={`tel:${hospital.phone}`}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" />
              Call Hospital Emergency
            </a>
          </div>

        </div>
      </div>

      {/* Grid of Hospital Stats & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ICU & Bed Availability */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bed className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">ICU Capacity</h3>
          <div className="text-3xl font-extrabold text-slate-900">
            {hospital.icuAvailableBeds} <span className="text-base font-semibold text-slate-500">/ {hospital.icuTotal} beds free</span>
          </div>
          <p className="text-xs text-slate-500">
            {hospital.icuAvailable ? '✓ Intensive Care Unit operational and accepting patients.' : '✗ ICU currently full or unavailable.'}
          </p>
        </div>

        {/* Emergency Dept Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Emergency Department</h3>
          <div className="text-xl font-extrabold text-emerald-600 flex items-center gap-1.5">
            {hospital.emergencyAvailable ? 'Open & Ready' : 'Closed'}
          </div>
          <p className="text-xs text-slate-500">
            Trauma team and emergency resuscitation bays on active duty.
          </p>
        </div>

        {/* Support Services */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">On-Site Support</h3>
          <div className="space-y-1 text-xs text-slate-700 font-medium">
            <div>• Ambulance: <strong>{hospital.ambulanceAvailable ? 'Available' : 'Unavailable'}</strong></div>
            <div>• Pharmacy: <strong>{hospital.pharmacyAvailable ? '24/7 Active' : 'Unavailable'}</strong></div>
            <div>• Blood Bank: <strong>Active On-Site</strong></div>
          </div>
        </div>

      </div>

      {/* Treatments & Specialists Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Specialists */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            Specialist Doctors On Duty
          </h3>

          <div className="flex flex-wrap gap-2">
            {hospital.specialists?.map((spec, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-xs">
                ✓ {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Treatments */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Activity className="w-5 h-5 text-purple-600" />
            Clinical Treatments Offered
          </h3>

          <div className="flex flex-wrap gap-2">
            {hospital.treatments?.map((t, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 font-semibold text-xs">
                ✓ {t}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Blood Bank Inventory Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Droplet className="w-5 h-5 text-rose-600" />
          Real-Time Blood Bank Inventory
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => {
            const units = (hospital.bloodAvailability && hospital.bloodAvailability[group]) || 0;
            return (
              <div 
                key={group}
                className={`p-3 rounded-xl border text-center ${units > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                <div className="text-xs font-bold text-slate-500 uppercase">{group}</div>
                <div className="text-lg font-extrabold">{units} <span className="text-xs font-normal">units</span></div>
                <div className="text-[10px] font-semibold mt-0.5">
                  {units > 5 ? 'Available' : units > 0 ? 'Low Stock' : 'Out of Stock'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Medicine Inventory */}
      {hospital.medicines && hospital.medicines.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Pill className="w-5 h-5 text-emerald-600" />
            Key Emergency Medicines Stock
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {hospital.medicines.map((med, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-800">{med.name}</div>
                  <div className="text-slate-500 text-[10px]">Stock: {med.quantity} units</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${med.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {med.available ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <DisclaimerBanner />

    </div>
  );
}
