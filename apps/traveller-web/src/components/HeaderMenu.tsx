"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HeaderMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('En');
  const [reviewText, setReviewText] = useState("");

  const submitReview = async () => {
    if (!reviewText.trim()) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: reviewText,
          timestamp: new Date().toISOString(),
          source: "web"
        })
      });
      
      if (response.ok) {
        alert("Thank you for your review!");
        setReviewText("");
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please check your connection.");
    }
  };

  return (
    <div className="flex items-center gap-3 mr-4">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors"
        >
          <div className="w-5 h-0.5 bg-white rounded-full"></div>
          <div className="w-5 h-0.5 bg-white rounded-full"></div>
          <div className="w-5 h-0.5 bg-white rounded-full"></div>
        </button>

        {/* Home Button */}
        <Link href="/" className="w-10 h-10 flex justify-center items-center bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors">
          <span className="text-white text-xl">🏠</span>
        </Link>
      </div>

      {/* Custom Language Selector inside Header */}
      <div className="relative hidden md:block">
        <button 
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center justify-center px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-full border border-slate-700 transition-colors text-sm font-bold"
        >
          {currentLang === 'En' ? 'Select Language' : currentLang}
        </button>
        {isLangOpen && (
          <div className="absolute left-0 mt-2 w-32 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden py-1 z-50">
            {[
              { label: 'English', code: 'en', display: 'En' },
              { label: 'ગુજરાતી', code: 'gu', display: 'ગુજરાતી' },
              { label: 'हिन्दी', code: 'hi', display: 'हिन्दी' }
            ].map(lang => (
              <button 
                key={lang.code}
                onClick={() => { 
                  setCurrentLang(lang.display); 
                  setIsLangOpen(false); 
                  
                  // Trigger Google Translate via cookie
                  document.cookie = `googtrans=/en/${lang.code}; path=/`;
                  document.cookie = `googtrans=/en/${lang.code}; domain=.${window.location.hostname}; path=/`;
                  window.location.reload();
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${currentLang === lang.display ? 'text-indigo-400 font-bold' : 'text-white'}`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown Block Menu */}
      {isMenuOpen && (
        <div className="absolute top-[70px] left-6 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 flex flex-col z-[9999] max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white">Main Menu</h2>
            <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>

            {/* Navigation Links */}
            <div className="flex-1 space-y-2">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">🏠 Home</Link>
              <Link href="/destinations" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">📍 Destinations</Link>
              <Link href="/plan" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">🤖 AI Trip Planner</Link>
              <Link href="/hotels" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">🏨 Hotels</Link>
              <Link href="/taxi" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">🚕 Outstation Cabs</Link>
              <Link href="/local-rides" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">🛵 Local Rides</Link>
              <Link href="/restaurants" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">🍽️ Restaurants</Link>
              <Link href="/tour-packages" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">🌴 Tour Packages</Link>
            </div>

            {/* App Settings */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <Link href="/settings" onClick={() => setIsMenuOpen(false)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left">
                <span>⚙️</span> App Settings
              </Link>
            </div>

            {/* Customer Review Section */}
            <div className="mt-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <h4 className="text-white text-sm font-bold mb-2">⭐ Write a Review</h4>
              <textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How was your experience?"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500 mb-2"
                rows={3}
              ></textarea>
              <button 
                onClick={submitReview}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded-lg font-bold transition-colors"
              >
                Submit Review
              </button>
            </div>
        </div>
      )}
    </div>
  );
}
