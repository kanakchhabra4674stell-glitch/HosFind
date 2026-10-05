import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FindHospitalPage from './pages/FindHospitalPage';
import HospitalDetailsPage from './pages/HospitalDetailsPage';
import EmergencyModePage from './pages/EmergencyModePage';
import BloodMedicinePage from './pages/BloodMedicinePage';
import HospitalDashboardPage from './pages/HospitalDashboardPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/find-hospital" element={<FindHospitalPage />} />
            <Route path="/hospital/:id" element={<HospitalDetailsPage />} />
            <Route path="/emergency" element={<EmergencyModePage />} />
            <Route path="/blood-medicine" element={<BloodMedicinePage />} />
            <Route path="/hospital-dashboard" element={<HospitalDashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
