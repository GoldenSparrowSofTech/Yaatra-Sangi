'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 pt-24 px-6 pb-12 font-sans text-slate-200">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">App Settings</h1>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 mb-8">
          
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-800/50">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">🔔 Notifications</h2>
              <p className="text-slate-400 text-sm mt-1">Receive push notifications for ride updates, bookings, and offers.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={notifications} onChange={() => setNotifications(!notifications)} />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-800/50">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">📍 Location Services</h2>
              <p className="text-slate-400 text-sm mt-1">Allow YatraSangi to access your GPS for accurate ride matching.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={locationServices} onChange={() => setLocationServices(!locationServices)} />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-800/50">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">🌙 Dark Mode</h2>
              <p className="text-slate-400 text-sm mt-1">Toggle the application theme.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">📶 Data Saver</h2>
              <p className="text-slate-400 text-sm mt-1">Reduce image quality and background syncing to save data.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={dataSaver} onChange={() => setDataSaver(!dataSaver)} />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

        </div>
        
        <Link href="/" className="inline-block mt-4 text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
