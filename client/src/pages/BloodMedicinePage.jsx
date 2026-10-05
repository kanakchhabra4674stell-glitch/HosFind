import React, { useState, useEffect } from 'react';
import { 
  Droplet, Pill, Search, MapPin, Clock, ShieldCheck, 
  Phone, Navigation, Loader2, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { getBloodInventoryAPI, getMedicineInventoryAPI } from '../utils/api';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function BloodMedicinePage() {
  const [activeTab, setActiveTab] = useState('blood'); // 'blood' or 'medicine'

  // Blood state
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [bloodList, setBloodList] = useState([]);
  const [loadingBlood, setLoadingBlood] = useState(false);

  // Medicine state
  const [searchMedicine, setSearchMedicine] = useState('Insulin');
  const [medicineList, setMedicineList] = useState([]);
  const [loadingMedicine, setLoadingMedicine] = useState(false);

  // Fetch Blood Data
  useEffect(() => {
    if (activeTab === 'blood') {
      fetchBlood();
    } else {
      fetchMedicine();
    }
  }, [activeTab, selectedBloodGroup]);

  const fetchBlood = async () => {
    setLoadingBlood(true);
    try {
      const res = await getBloodInventoryAPI(selectedBloodGroup, 28.6139, 77.2090);
      if (res && res.data) {
        setBloodList(res.data);
      }
    } catch (err) {
      console.error('Error fetching blood inventory:', err);
    } finally {
      setLoadingBlood(false);
    }
  };

  const fetchMedicine = async () => {
    setLoadingMedicine(true);
    try {
      const res = await getMedicineInventoryAPI(searchMedicine, 28.6139, 77.2090);
      if (res && res.data) {
        setMedicineList(res.data);
      }
    } catch (err) {
      console.error('Error fetching medicine inventory:', err);
    } finally {
      setLoadingMedicine(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <Droplet className="w-4 h-4 text-rose-400" />
            Inventory Tracker
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Blood & Medicine Finder
          </h1>

          <p className="text-slate-300 text-sm sm:text-base">
            Locate verified hospital blood bank units and essential emergency pharmaceutical stocks in real-time.
          </p>

          {/* Tabs switch */}
          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={() => setActiveTab('blood')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === 'blood' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Droplet className="w-4 h-4" />
              Blood Bank Inventory
            </button>

            <button
              onClick={() => setActiveTab('medicine')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 ${activeTab === 'medicine' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              <Pill className="w-4 h-4" />
              Emergency Medicine Search
            </button>
          </div>

        </div>
      </div>

      {/* BLOOD TAB CONTENT */}
      {activeTab === 'blood' && (
        <div className="space-y-6">
          
          {/* Blood Group Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-bold text-slate-800">Filter by Blood Group:</div>
            
            <div className="flex gap-2 flex-wrap">
              {['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedBloodGroup(group)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${selectedBloodGroup === group ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Results list */}
          {loadingBlood ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-600 mb-2" />
              <div className="text-sm font-semibold text-slate-600">Querying hospital blood banks...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bloodList.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-1">
                        <ShieldCheck className="w-3 h-3" /> {item.verificationStatus || 'Verified'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{item.hospitalName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> {item.address}
                      </p>
                    </div>

                    <div className="px-3 py-1 bg-rose-50 text-rose-700 font-extrabold text-lg rounded-xl border border-rose-200 text-center">
                      {item.bloodGroup}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Availability:</span>{' '}
                      <strong className={item.units > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {item.units} Units ({item.status})
                      </strong>
                    </div>
                    <span className="text-slate-400 text-[10px]">
                      {item.distanceKm} km (~{item.travelTimeMin} min)
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Navigate
                    </a>
                    <a
                      href={`tel:${item.phone}`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-300"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* MEDICINE TAB CONTENT */}
      {activeTab === 'medicine' && (
        <div className="space-y-6">
          
          {/* Medicine Search Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchMedicine}
                onChange={(e) => setSearchMedicine(e.target.value)}
                placeholder="Search medicine name (e.g. Insulin, Remdesivir, Heparin)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium outline-none focus:border-purple-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            <button
              onClick={fetchMedicine}
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition"
            >
              Search Stock
            </button>
          </div>

          {/* Medicine Results */}
          {loadingMedicine ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600 mb-2" />
              <div className="text-sm font-semibold text-slate-600">Checking pharmacy stock across hospitals...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicineList.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-1">
                        <ShieldCheck className="w-3 h-3" /> {item.verificationStatus || 'Verified Pharmacy'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">{item.hospitalName}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${item.available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs flex justify-between">
                    <div>Quantity: <strong>{item.quantity} units</strong></div>
                    <div>Distance: <strong>{item.distanceKm} km</strong></div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Navigate
                    </a>
                    <a
                      href={`tel:${item.phone}`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 border border-slate-300"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Pharmacy
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      <DisclaimerBanner />

    </div>
  );
}
