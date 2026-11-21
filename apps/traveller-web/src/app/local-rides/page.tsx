'use client';
import { useState } from 'react';
import Link from 'next/link';

interface LocalDriver {
  id: string;
  slug: string;
  name: string;
  category: 'auto' | 'bike' | 'cab';
  vehicleType: string;
  vehicleModel: string;
  vehicleNumber: string;
  rating: number;
  reviews: number;
  baseFare: number;
  perKmRate: number;
  city: string;
  contactPhone: string;
  image: string;
  languages: string[];
}

const LOCAL_DRIVERS: LocalDriver[] = [
  {
    id: '1',
    slug: 'ramesh-bhai',
    name: 'Ramesh Bhai Patel',
    category: 'auto',
    vehicleType: 'Auto Rickshaw',
    vehicleModel: 'Bajaj RE Compact',
    vehicleNumber: 'GJ-01-AB-1234',
    rating: 4.8,
    reviews: 420,
    baseFare: 30,
    perKmRate: 15,
    city: 'Ahmedabad, Gujarat',
    contactPhone: '+919876511111',
    image: 'https://images.unsplash.com/photo-1598008851410-a43588df252f?auto=format&fit=crop&q=80',
    languages: ['Gujarati', 'Hindi'],
  },
  {
    id: '2',
    slug: 'suresh-kumar',
    name: 'Suresh Kumar',
    category: 'bike',
    vehicleType: 'Bike Taxi',
    vehicleModel: 'Hero Splendor Plus',
    vehicleNumber: 'GJ-03-BK-5678',
    rating: 4.9,
    reviews: 310,
    baseFare: 20,
    perKmRate: 8,
    city: 'Rajkot, Gujarat',
    contactPhone: '+919876522222',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80',
    languages: ['Hindi', 'Gujarati'],
  },
  {
    id: '3',
    slug: 'vikram-singh',
    name: 'Vikram Singh',
    category: 'cab',
    vehicleType: 'City Cab (AC)',
    vehicleModel: 'Maruti Suzuki WagonR',
    vehicleNumber: 'GJ-03-TC-9012',
    rating: 4.9,
    reviews: 215,
    baseFare: 50,
    perKmRate: 14,
    city: 'Rajkot, Gujarat',
    contactPhone: '+919876533333',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80',
    languages: ['Hindi', 'English', 'Gujarati'],
  },
];

export default function LocalRidesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'auto' | 'bike' | 'cab'>('all');
  const [searchCity, setSearchCity] = useState('');

  const filteredDrivers = LOCAL_DRIVERS.filter((driver) => {
    const matchesCategory = selectedCategory === 'all' || driver.category === selectedCategory;
    const matchesCity = !searchCity || driver.city.toLowerCase().includes(searchCity.toLowerCase()) || driver.name.toLowerCase().includes(searchCity.toLowerCase());
    return matchesCategory && matchesCity;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 inline-flex items-center gap-2 mb-4 text-sm font-semibold transition-colors">
            ← Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-yellow-500/30">
                  ADR-001 Direct Directory
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                  0% Commission
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                Local Rides <span className="text-yellow-400">Directory</span>
              </h1>
              <p className="text-slate-400 mt-2 text-base max-w-2xl">
                Connect directly with verified local auto-rickshaw, bike, and city cab drivers. Deal directly with drivers for transparent fares without middleman booking commissions.
              </p>
            </div>
            
            {/* Quick Stat Pill */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-2xl border border-yellow-400/20">
                🛺
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Free Provider Listings</p>
                <p className="text-lg font-bold text-white">100% Free For Drivers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Rides
            </button>
            <button
              onClick={() => setSelectedCategory('auto')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'auto'
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🛺</span> Auto Rickshaw
            </button>
            <button
              onClick={() => setSelectedCategory('bike')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'bike'
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🛵</span> Bike Taxi
            </button>
            <button
              onClick={() => setSelectedCategory('cab')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'cab'
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🚕</span> City Cab
            </button>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search by city or driver..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-slate-900 border border-slate-800 hover:border-yellow-500/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badge */}
                <div className="h-44 relative bg-slate-800 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${driver.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-400 border border-yellow-400/30 flex items-center gap-1">
                    <span>{driver.category === 'auto' ? '🛺' : driver.category === 'bike' ? '🛵' : '🚕'}</span>
                    {driver.vehicleType}
                  </div>

                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                    <span>⭐</span> {driver.rating} <span className="text-slate-400 font-normal">({driver.reviews})</span>
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{driver.name}</h3>
                    <p className="text-xs text-slate-300 font-medium">📍 {driver.city}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-5 space-y-4">
                  {/* Vehicle Spec */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="text-slate-400">Model</p>
                      <p className="font-bold text-slate-200">{driver.vehicleModel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">Plate Number</p>
                      <p className="font-bold text-yellow-400 tracking-wider font-mono">{driver.vehicleNumber}</p>
                    </div>
                  </div>

                  {/* Pricing Guide */}
                  <div className="flex justify-between items-center text-sm py-1 border-b border-slate-800/60">
                    <div>
                      <span className="text-slate-400 text-xs block">Base Fare</span>
                      <span className="text-white font-bold text-base">₹{driver.baseFare}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-xs block">Distance Rate</span>
                      <span className="text-emerald-400 font-bold text-base">₹{driver.perKmRate} <span className="text-xs font-normal text-slate-400">/ km</span></span>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>🗣️ Languages:</span>
                    <span className="text-slate-300 font-medium">{driver.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${driver.contactPhone}`}
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <span>📞</span> Call Driver
                  </a>
                  <a
                    href={`https://wa.me/${driver.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${driver.name}, I found your ride listing on YaatraSangi. Are you available for a ride?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-green-600/20"
                  >
                    <span>💬</span> WhatsApp
                  </a>
                </div>
                
                <Link
                  href={`/local-rides/${driver.slug}`}
                  className="w-full block text-center py-2 text-xs font-semibold text-slate-400 hover:text-yellow-400 transition-colors border border-transparent hover:border-slate-800 rounded-lg"
                >
                  View Driver Profile & Rates →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust & Policy Notice */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              🤝
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white">Direct-Connection Marketplace Policy</h4>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                YaatraSangi connects travellers directly with independent local drivers. We do not dispatch rides, assign drivers, or charge passenger booking commissions. Fares, routes, and payments are settled directly between passenger and driver in cash or direct UPI.
              </p>
            </div>
            <Link
              href="/partner-onboarding"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 rounded-xl text-xs font-bold whitespace-nowrap border border-slate-700 transition-colors shrink-0"
            >
              Driver Registration (Free) →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
