import React from 'react';
import { HeartPulse, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">HospitalFinder</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md mb-4">
              Find the RIGHT hospital at the RIGHT time. Intelligent emergency routing based on real-time treatment capabilities, specialist availability, ICU capacity, and blood inventory.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 w-fit px-3 py-1.5 rounded-full border border-slate-700">
              <ShieldCheck className="w-4 h-4" />
              <span>NABH & Health Data Verification Standard Verified</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/find-hospital" className="hover:text-white transition">Find Hospital</a></li>
              <li><a href="/emergency" className="hover:text-red-400 transition font-medium">Emergency Care Mode</a></li>
              <li><a href="/blood-medicine" className="hover:text-white transition">Blood Bank Finder</a></li>
              <li><a href="/hospital-dashboard" className="hover:text-white transition">Staff Management Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Safety & Disclaimer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This application is a prototype routing assistant designed to help patients find hospitals capable of addressing specific medical requirements. It is NOT a medical diagnostic tool. In case of extreme emergency, call 102/108/911.
            </p>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Hospital Finder Prototype. Built for Hackathon & Emergency Preparedness.</p>
          <p>Location-Based Medical Routing Engine v1.0</p>
        </div>
      </div>
    </footer>
  );
}
