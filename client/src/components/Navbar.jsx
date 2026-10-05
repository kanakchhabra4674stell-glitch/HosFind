import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Hospital, Search, Droplet, LayoutDashboard, AlertCircle, HeartPulse } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:bg-blue-700 transition">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Hospital<span className="text-blue-600">Finder</span></span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">Right Care • Right Time</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive('/') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Home
            </Link>

            <Link 
              to="/find-hospital" 
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${isActive('/find-hospital') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <Search className="w-4 h-4" />
              Find Hospital
            </Link>

            <Link 
              to="/blood-medicine" 
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${isActive('/blood-medicine') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <Droplet className="w-4 h-4 text-rose-500" />
              Blood & Medicine
            </Link>

            <Link 
              to="/hospital-dashboard" 
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${isActive('/hospital-dashboard') ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Hospital Dashboard
            </Link>
          </nav>

          {/* Emergency Mode CTA */}
          <div className="flex items-center gap-3">
            <Link 
              to="/emergency" 
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-bold text-sm shadow-md hover:bg-red-700 transition animate-pulse hover:animate-none"
            >
              <AlertCircle className="w-4 h-4" />
              Emergency Mode
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
