"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = "/login";
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Manage <span className="text-[#0d59a8]">Yaatra</span><span className="text-[#f97316]">Sangi</span> data and bookings</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors border border-slate-700"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-white">24</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Total Bookings</h3>
            <p className="text-4xl font-bold text-white">156</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Active Partners</h3>
            <p className="text-4xl font-bold text-white">12</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Revenue (Demo)</h3>
            <p className="text-4xl font-bold text-emerald-400">₹45,200</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/seed" className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 p-6 rounded-xl hover:border-indigo-500 transition-colors group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">🗄️</div>
            <h3 className="text-xl font-bold text-white mb-2">Initialize Database</h3>
            <p className="text-slate-400 text-sm">Upload demo data (Hotels, Taxis, Packages) to Firebase.</p>
          </Link>
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl opacity-50 cursor-not-allowed">
            <div className="text-4xl mb-4">🏨</div>
            <h3 className="text-xl font-bold text-white mb-2">Manage Hotels</h3>
            <p className="text-slate-400 text-sm">Add or edit hotel listings (Coming Soon).</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl opacity-50 cursor-not-allowed">
            <div className="text-4xl mb-4">🚕</div>
            <h3 className="text-xl font-bold text-white mb-2">Manage Taxis</h3>
            <p className="text-slate-400 text-sm">Add or edit taxi services (Coming Soon).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
