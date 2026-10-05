import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, AlertCircle, HeartPulse, Brain, Cpu, 
  MapPin, CheckCircle2, ShieldAlert, ArrowRight,
  Activity, Stethoscope, Droplet, Bed
} from 'lucide-react';
import DisclaimerBanner from '../components/DisclaimerBanner';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <HeartPulse className="w-4 h-4 text-blue-400" />
            AI-Powered Clinical Routing Engine
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">RIGHT Hospital</span> at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">RIGHT TIME</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            “Tell us what you need. We’ll find hospitals that can actually help.”
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/find-hospital"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 text-base"
            >
              <Search className="w-5 h-5" />
              Find a Hospital
            </Link>

            <Link
              to="/emergency"
              className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 text-base animate-pulse hover:animate-none"
            >
              <AlertCircle className="w-5 h-5" />
              Emergency Mode
            </Link>
          </div>

          {/* Core USP Banner */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-amber-300 font-semibold text-sm">
              💡 Core USP: “Don’t just find the nearest hospital. Find the hospital that can help.”
            </div>
          </div>

          <div className="max-w-xl mx-auto text-xs text-slate-400 italic">
            This tool provides routing assistance only and is not a diagnostic system.
          </div>

        </div>

      </section>

      {/* Visual Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How Hospital Finder Works
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Our 5-step intelligent clinical matching workflow matches requirements to real-time hospital resource capabilities.
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 relative group hover:border-blue-500 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-lg shadow-inner">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Patient Requirement</h3>
            <p className="text-xs text-slate-500">Describe symptoms or medical needs in natural plain language.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center text-slate-300">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 relative group hover:border-purple-500 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-lg shadow-inner">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">AI Requirement Extraction</h3>
            <p className="text-xs text-slate-500">Extracts treatment, specialist, ICU, emergency level, & blood group.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center text-slate-300">
            <ArrowRight className="w-6 h-6" />
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 relative group hover:border-emerald-500 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-lg shadow-inner">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Smart Hospital Matching</h3>
            <p className="text-xs text-slate-500">Runs 6-factor weighted algorithm (30% Treatment, 20% Specialist, etc.).</p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 max-w-3xl mx-auto">
          {/* Step 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 hover:border-amber-500 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-lg shadow-inner">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Ranked Suitable Hospitals</h3>
            <p className="text-xs text-slate-500">View hospitals with transparent match score breakdowns & explanations.</p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 hover:border-blue-600 transition md:col-span-2">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-inner">
              5
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Instant Navigation & Contact</h3>
            <p className="text-xs text-slate-500">One-tap Google Maps directions link & direct call connection.</p>
          </div>
        </div>

      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Natural Language AI</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Describe symptoms in your own words (e.g. "father has chest pain, need cardiologist & ICU"). Our AI extracts structured clinical parameters automatically.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Weighted Match Engine</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Calculates scores based on 30% Treatment, 20% Specialist, 15% Capacity, 15% Blood/Medicine, 10% Travel Time, and 10% Proximity.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
              <Droplet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Blood & Medicine Tracking</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Search live blood bank stocks (O+, A-, etc.) and critical emergency medicine inventories across nearby hospitals instantly.
            </p>
          </div>

        </div>

      </section>

      {/* Safety Disclaimer Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <DisclaimerBanner />
      </section>

    </div>
  );
}
