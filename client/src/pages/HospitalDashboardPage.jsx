import React, { useState, useEffect } from 'react';
import { 
  Building2, Save, Plus, Trash2, CheckCircle2, 
  AlertCircle, Bed, Droplet, Pill, Stethoscope, Activity, Loader2 
} from 'lucide-react';
import { getHospitalsAPI, getHospitalByIdAPI, updateHospitalAvailabilityAPI } from '../utils/api';

export default function HospitalDashboardPage() {
  const [hospitalsList, setHospitalsList] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    latitude: 28.6385,
    longitude: 77.1894,
    emergencyAvailable: true,
    icuAvailable: true,
    icuTotal: 40,
    icuAvailableBeds: 5,
    ambulanceAvailable: true,
    pharmacyAvailable: true,
    openStatus: 'Open 24/7',
    verificationStatus: 'Verified Partner',
    specialists: [],
    treatments: [],
    bloodAvailability: {
      'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0,
      'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
    },
    medicines: []
  });

  const [newSpecialist, setNewSpecialist] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [newMedName, setNewMedName] = useState('');
  const [newMedQty, setNewMedQty] = useState(10);

  // Load all hospitals for selection
  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setIsLoading(true);
    try {
      const res = await getHospitalsAPI();
      if (res && res.data && res.data.length > 0) {
        setHospitalsList(res.data);
        const first = res.data[0];
        setSelectedHospitalId(first._id);
        populateForm(first);
      }
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHospital = (id) => {
    setSelectedHospitalId(id);
    const found = hospitalsList.find(h => String(h._id) === String(id));
    if (found) {
      populateForm(found);
    }
  };

  const populateForm = (h) => {
    setFormData({
      name: h.name || '',
      address: h.address || '',
      phone: h.phone || '',
      latitude: h.latitude || 28.6139,
      longitude: h.longitude || 77.2090,
      emergencyAvailable: h.emergencyAvailable ?? true,
      icuAvailable: h.icuAvailable ?? true,
      icuTotal: h.icuTotal ?? 20,
      icuAvailableBeds: h.icuAvailableBeds ?? 5,
      ambulanceAvailable: h.ambulanceAvailable ?? true,
      pharmacyAvailable: h.pharmacyAvailable ?? true,
      openStatus: h.openStatus || 'Open 24/7',
      verificationStatus: h.verificationStatus || 'Verified Staff Portal',
      specialists: h.specialists ? [...h.specialists] : [],
      treatments: h.treatments ? [...h.treatments] : [],
      bloodAvailability: h.bloodAvailability ? { ...h.bloodAvailability } : {
        'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0
      },
      medicines: h.medicines ? [...h.medicines] : []
    });
  };

  // Add/Remove Specialists
  const handleAddSpecialist = () => {
    if (newSpecialist.trim() && !formData.specialists.includes(newSpecialist.trim())) {
      setFormData({
        ...formData,
        specialists: [...formData.specialists, newSpecialist.trim()]
      });
      setNewSpecialist('');
    }
  };

  const handleRemoveSpecialist = (spec) => {
    setFormData({
      ...formData,
      specialists: formData.specialists.filter(s => s !== spec)
    });
  };

  // Add/Remove Treatments
  const handleAddTreatment = () => {
    if (newTreatment.trim() && !formData.treatments.includes(newTreatment.trim())) {
      setFormData({
        ...formData,
        treatments: [...formData.treatments, newTreatment.trim()]
      });
      setNewTreatment('');
    }
  };

  const handleRemoveTreatment = (t) => {
    setFormData({
      ...formData,
      treatments: formData.treatments.filter(item => item !== t)
    });
  };

  // Update Blood Unit Counts
  const handleBloodChange = (group, units) => {
    setFormData({
      ...formData,
      bloodAvailability: {
        ...formData.bloodAvailability,
        [group]: Math.max(0, parseInt(units) || 0)
      }
    });
  };

  // Add/Remove Medicines
  const handleAddMedicine = () => {
    if (newMedName.trim()) {
      setFormData({
        ...formData,
        medicines: [
          ...formData.medicines,
          { name: newMedName.trim(), available: true, quantity: Math.max(0, parseInt(newMedQty) || 0) }
        ]
      });
      setNewMedName('');
      setNewMedQty(10);
    }
  };

  const handleRemoveMedicine = (idx) => {
    setFormData({
      ...formData,
      medicines: formData.medicines.filter((_, i) => i !== idx)
    });
  };

  // Submit Save Handler
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedHospitalId) return;

    setIsSaving(true);
    setSaveSuccessMsg('');

    try {
      const res = await updateHospitalAvailabilityAPI(selectedHospitalId, formData);
      if (res && res.success) {
        setSaveSuccessMsg(`Availability and inventory updated for ${formData.name} at ${new Date().toLocaleTimeString()}!`);
        // Refresh local hospital list entry
        setHospitalsList(hospitalsList.map(h => String(h._id) === String(selectedHospitalId) ? res.data : h));
      }
    } catch (err) {
      console.error('Error saving hospital availability:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
        <p className="text-slate-600 text-sm">Loading staff management portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Hospital Staff Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hospital Dashboard</h1>
          <p className="text-slate-300 text-sm mt-1">
            Update ICU beds, blood bank units, specialist on-duty status, and emergency availability in real-time.
          </p>
        </div>

        {/* Hospital Selector */}
        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 space-y-1">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Hospital to Manage:</label>
          <select
            value={selectedHospitalId}
            onChange={(e) => handleSelectHospital(e.target.value)}
            className="w-full bg-slate-900 text-white p-2.5 rounded-xl text-sm font-semibold border border-slate-700 outline-none"
          >
            {hospitalsList.map((h) => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-2xl text-sm font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg('')} className="text-xs underline text-emerald-700">Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Basic Hospital Info & Coordinates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Hospital Profile & Location Coordinates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block font-semibold text-slate-700 text-xs mb-1">Hospital Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 text-xs mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 text-xs mb-1">Full Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 text-xs mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 text-xs mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Bed Capacity & Emergency Services */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bed className="w-5 h-5 text-emerald-600" />
            Bed Capacity & Operational Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-800 text-xs">Total ICU Beds</label>
              <input
                type="number"
                value={formData.icuTotal}
                onChange={(e) => setFormData({ ...formData, icuTotal: parseInt(e.target.value) || 0 })}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900"
              />
            </div>

            <div className="space-y-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <label className="block font-bold text-emerald-900 text-xs">Available ICU Beds FREE Now</label>
              <input
                type="number"
                value={formData.icuAvailableBeds}
                onChange={(e) => setFormData({ ...formData, icuAvailableBeds: parseInt(e.target.value) || 0 })}
                className="w-full p-2 bg-white border border-emerald-300 rounded-xl text-lg font-extrabold text-emerald-800"
              />
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 mb-2">Service Toggles</div>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.emergencyAvailable}
                  onChange={(e) => setFormData({ ...formData, emergencyAvailable: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Emergency Department Ready</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.icuAvailable}
                  onChange={(e) => setFormData({ ...formData, icuAvailable: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>ICU Unit Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.pharmacyAvailable}
                  onChange={(e) => setFormData({ ...formData, pharmacyAvailable: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>24/7 Pharmacy Active</span>
              </label>
            </div>

          </div>
        </div>

        {/* Section 3: Specialists & Treatments Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Specialists */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              Specialist Doctors List
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialist}
                onChange={(e) => setNewSpecialist(e.target.value)}
                placeholder="e.g. Cardiologist, Neurologist..."
                className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
              />
              <button
                type="button"
                onClick={handleAddSpecialist}
                className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.specialists.map((spec, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  {spec}
                  <button type="button" onClick={() => handleRemoveSpecialist(spec)} className="text-rose-500 hover:text-rose-700 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Treatments */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Activity className="w-4 h-4 text-purple-600" />
              Clinical Treatments Offered
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTreatment}
                onChange={(e) => setNewTreatment(e.target.value)}
                placeholder="e.g. Cardiology, Orthopedics..."
                className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
              />
              <button
                type="button"
                onClick={handleAddTreatment}
                className="px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.treatments.map((t, idx) => (
                <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                  {t}
                  <button type="button" onClick={() => handleRemoveTreatment(t)} className="text-rose-500 hover:text-rose-700 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Section 4: Blood Availability Inventory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Droplet className="w-4 h-4 text-rose-600" />
            Update Blood Bank Stock (Units Available)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
              <div key={group} className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-center space-y-1">
                <label className="block text-xs font-extrabold text-rose-900">{group}</label>
                <input
                  type="number"
                  min="0"
                  value={formData.bloodAvailability[group] || 0}
                  onChange={(e) => handleBloodChange(group, e.target.value)}
                  className="w-full p-1.5 bg-white border border-rose-300 rounded-lg text-center font-bold text-sm text-slate-900"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Medicine Inventory */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <Pill className="w-4 h-4 text-emerald-600" />
            Emergency Medicine Stock Management
          </h3>

          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              placeholder="Medicine Name (e.g. Insulin)..."
              className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium min-w-[200px]"
            />
            <input
              type="number"
              value={newMedQty}
              onChange={(e) => setNewMedQty(e.target.value)}
              placeholder="Quantity"
              className="w-24 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
            />
            <button
              type="button"
              onClick={handleAddMedicine}
              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medicine
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {formData.medicines.map((med, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-800">{med.name}</div>
                  <div className="text-slate-500">Stock: {med.quantity} units</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedicine(idx)}
                  className="text-rose-500 hover:text-rose-700 font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl shadow-xl transition flex items-center gap-2 text-base disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Availability to MongoDB
          </button>
        </div>

      </form>

    </div>
  );
}
