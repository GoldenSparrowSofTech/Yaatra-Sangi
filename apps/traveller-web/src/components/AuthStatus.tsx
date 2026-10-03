"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function AuthStatus() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isMockUser = localStorage.getItem('userAuth') === 'true';
    const mockData = localStorage.getItem('userData');
    
    if (isMockUser) {
      setUser(mockData ? JSON.parse(mockData) : { displayName: 'Traveler' });
      setLoading(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userData');
    await signOut(auth);
    window.location.href = '/';
  };

  if (loading) {
    return <div className="h-9 w-20 bg-slate-800 animate-pulse rounded-full"></div>;
  }

  const displayName = user?.name || user?.displayName || user?.email?.split('@')[0] || 'Traveler';

  return (
    <div className="relative z-50 flex items-center gap-4 ml-auto">
      {user ? (
        <div className="flex items-center gap-2">
          {/* Highlighted Local Rides Button */}
          <Link href="/local-rides" className="hidden sm:flex bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1.5 rounded-full text-sm font-bold transition-colors shadow-[0_0_15px_rgba(250,204,21,0.2)] items-center gap-1.5 whitespace-nowrap">
            <span className="flex items-center text-sm"><span className="text-yellow-400">🛺</span><span className="text-orange-400 -ml-1">🛵</span></span>
            Local Rides
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </Link>
          <Link href="/vendor" className="hidden md:flex bg-indigo-600/90 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 items-center gap-2 whitespace-nowrap">
            <span>💼</span> Partner Login
          </Link>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-full border border-slate-700">
            <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium mr-2 text-white whitespace-nowrap">{displayName}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-xs font-bold bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 ml-auto">
          {/* Highlighted Local Rides Button */}
          <Link href="/local-rides" className="hidden sm:flex bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1.5 rounded-full text-sm font-bold transition-colors shadow-[0_0_15px_rgba(250,204,21,0.2)] items-center gap-1.5 whitespace-nowrap">
            <span className="flex items-center text-sm"><span className="text-yellow-400">🛺</span><span className="text-orange-400 -ml-1">🛵</span></span>
            Local Rides
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </Link>
          <Link href="/vendor" className="hidden md:flex bg-indigo-600/90 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20 items-center gap-2 whitespace-nowrap">
            <span>💼</span> Partner Login
          </Link>
          <Link href="/login" className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white rounded-full transition-all whitespace-nowrap shadow-lg shadow-indigo-500/25">
            Login / Join
          </Link>
        </div>
      )}
    </div>
  );
}
