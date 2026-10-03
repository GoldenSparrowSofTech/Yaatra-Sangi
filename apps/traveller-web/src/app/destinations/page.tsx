"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DestinationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Trending', 'Romantic', 'Adventure', 'Heritage'];

  useEffect(() => {
    fetch('http://localhost:3004/destinations')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDestinations(data);
        }
      })
      .catch(err => console.error("Failed to load destinations", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDestinations = activeTab === 'All' 
    ? destinations 
    : destinations.filter(d => d.type === activeTab);

  return (
    <main 
      className="min-h-screen pt-24 pb-16 relative bg-slate-950"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.8), rgba(2, 6, 23, 1)), url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium mb-6 transition-colors">
            <span className="mr-2">&larr;</span> Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Destinations</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light">
            Discover India's most beautiful cities, hand-picked for your perfect next vacation.
          </p>
        </div>

        {/* Categories / Tabs */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'bg-slate-900/80 border border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Destinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <Link href={`/destinations/${dest.id}`} key={dest.id} className="group relative h-[400px] rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl block">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url(${dest.image})` }}
              ></div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              {/* Top Tag */}
              <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{dest.type}</p>
              </div>

              {/* Content Bottom */}
              <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end transform transition-transform duration-500">
                <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">{dest.name}</h3>
                <p className="text-slate-300 text-sm mb-4 font-light">{dest.description || dest.subtitle}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-700">
                    {dest.placesToVisit?.length || 0} things to do
                  </span>
                  <span className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-emerald-500 transition-colors">
                    &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
