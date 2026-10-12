'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(false);
  const [locationServices, setLocationServices] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  useEffect(() => {
    // Check initial preferences from localStorage
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light') {
        setDarkMode(false);
        document.documentElement.classList.add('light-theme-forced');
      }
      setNotifications(Notification.permission === 'granted');
    }
  }, []);

  const handleNotificationToggle = (val: boolean) => {
    setNotifications(val);
    if (val && typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('YaatraSangi', { body: 'Notifications enabled successfully!' });
        } else {
          setNotifications(false);
        }
      });
    }
  };

  const handleLocationToggle = (val: boolean) => {
    setLocationServices(val);
    if (val && typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => alert(`Location accessed successfully: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        (err) => { alert('Location access denied.'); setLocationServices(false); }
      );
    }
  };

  const handleThemeToggle = (val: boolean) => {
    setDarkMode(val);
    if (typeof window !== 'undefined') {
      if (!val) {
        document.documentElement.classList.add('light-theme-forced');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light-theme-forced');
        localStorage.setItem('theme', 'dark');
      }
    }
  };

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
              <input type="checkbox" className="sr-only peer" checked={notifications} onChange={(e) => handleNotificationToggle(e.target.checked)} />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-800/50">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">📍 Location Services</h2>
              <p className="text-slate-400 text-sm mt-1">Allow YaatraSangi to access your GPS for accurate ride matching.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={locationServices} onChange={(e) => handleLocationToggle(e.target.checked)} />
              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-800/50">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">🌙 Dark Mode</h2>
              <p className="text-slate-400 text-sm mt-1">Toggle the application theme.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={(e) => handleThemeToggle(e.target.checked)} />
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
