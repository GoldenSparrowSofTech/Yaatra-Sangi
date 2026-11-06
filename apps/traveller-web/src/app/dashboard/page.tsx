"use client";

import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      window.location.href = '/login';
    }
  }, []);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 pt-28">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Welcome, {userData.name || userData.email?.split('@')[0] || 'Traveler'}! 👋</h1>
        <p className="text-slate-400 mb-10">Manage your trips and explore history.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Profile Info</h2>
            <div className="space-y-3">
              <p className="text-slate-400">Name: <span className="text-white font-medium">{userData.name || userData.email?.split('@')[0] || 'Traveler'}</span></p>
              <p className="text-slate-400">Email: <span className="text-white font-medium">{userData.email || 'traveler@yatrasangi.com'}</span></p>
              <p className="text-slate-400">Mobile: <span className="text-white font-medium">+91 {userData.mobile || '9876543210'}</span></p>
              <p className="text-slate-400">City: <span className="text-white font-medium">{userData.city || 'Ahmedabad'}</span></p>
              <p className="text-slate-400">State: <span className="text-white font-medium">{userData.state || 'Gujarat'}</span></p>
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">Your Trip History 🗺️</h2>
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 text-center">
              <span className="text-4xl mb-4 block">🧳</span>
              <h3 className="text-lg font-bold text-slate-300">No Trips Planned Yet</h3>
              <p className="text-slate-500 mb-4">Start planning your next adventure with our AI Trip Planner!</p>
              <a href="/plan" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-6 rounded-full transition-colors">
                Plan a Trip
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
