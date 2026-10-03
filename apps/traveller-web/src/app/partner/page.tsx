import React from 'react';
import Link from 'next/link';

export default function PartnerDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 px-6 pb-12 font-sans text-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Partner <span className="text-emerald-400">Dashboard</span></h1>
          <p className="text-slate-400">Manage your business on YatraSangi</p>
        </div>

        {/* Trial Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-8 flex items-center">
          <div className="text-5xl mr-6">🎁</div>
          <div>
            <h2 className="text-emerald-400 text-xl font-bold mb-1">3 Months Free Trial Active!</h2>
            <p className="text-emerald-200/70 text-sm">Enjoy zero commission and unlimited access. Billing of ₹XYZ starts automatically after 90 days.</p>
          </div>
        </div>

        {/* Pricing Structure */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Pricing Structure (After Trial)</h2>
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-semibold text-slate-300">Hotels</span>
                <span className="text-slate-400 text-sm">1st Hotel: ₹XYZ | 2nd Hotel: ₹XYZ</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-semibold text-slate-300">Outstation Cabs</span>
                <span className="text-slate-400 text-sm">1st Car: ₹XYZ | 2nd Car: ₹XYZ</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-semibold text-slate-300">Local Rides (Bikes)</span>
                <span className="text-slate-400 text-sm">1st Bike: ₹XYZ | 2nd Bike: ₹XYZ</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="font-semibold text-slate-300">Tour Packages</span>
                <span className="text-slate-400 text-sm">Flat ₹XYZ per package listing</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-semibold text-slate-300">Restaurants</span>
                <span className="text-slate-400 text-sm">Base fee ₹XYZ + Optional Promos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* My Assets */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Listed Assets (0)</h2>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl transition-colors">
            + Add Asset
          </button>
        </div>

        <div className="bg-slate-900/30 border border-white/5 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">No Assets Listed Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Start adding your hotels, cabs, or bikes to get direct bookings from travelers!
          </p>
        </div>

      </div>
    </div>
  );
}
