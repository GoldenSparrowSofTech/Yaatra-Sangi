'use client';
import { useState, useEffect } from 'react';

export default function TourPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const url = new URL(`${apiUrl}/packages`);
        if (searchQuery) url.searchParams.append('location', searchQuery);
        
        const res = await fetch(url.toString());
        const pkgList = await res.json();
        
        if (pkgList && pkgList.length > 0) {
          setPackages(pkgList);
        } else {
          // Fallback
          setPackages([
            { id: 1, slug: 'goa-4-days', title: "Goa Weekend Getaway", duration: "4 Days / 3 Nights", price: 12500, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80", rating: 4.8, reviews: 124, features: ["Hotel Included", "Sightseeing", "Breakfast", "Airport Transfer"], vendorName: "Goa Beach Travels" },
            { id: 2, slug: 'manali-trip', title: "Manali Snow Adventure", duration: "6 Days / 5 Nights", price: 18900, image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80", rating: 4.9, reviews: 89, features: ["3 Star Hotel", "Snow Activities", "Meals Included", "Transport"], vendorName: "Himalayan Trekkers" },
            { id: 3, slug: 'kerala-tour', title: "Kerala Backwaters & Tea Gardens", duration: "5 Days / 4 Nights", price: 16500, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80", rating: 4.7, reviews: 210, features: ["Houseboat Stay", "Munnar Tour", "All Meals", "Ayurvedic Spa"], vendorName: "God's Own Holidays" }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch packages", error);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchPackages();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <main 
      className="min-h-screen pt-20 pb-12 relative overflow-x-hidden bg-slate-950"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.7), rgba(2, 6, 23, 1)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">Exclusive Tour Packages</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light drop-shadow-md mb-8">
            Directly from local travel agents. 0% Commission. Best Prices Guaranteed.
          </p>
          
          <div className="max-w-xl mx-auto flex gap-2">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination (e.g. Goa, Manali)"
              className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all hover:-translate-y-2 group shadow-2xl flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${pkg.image})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold border border-slate-700">
                  {pkg.duration}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white leading-tight">{pkg.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-bold">{pkg.rating}</span>
                  <span className="text-slate-400 text-sm">({pkg.reviews} reviews)</span>
                  <span className="text-slate-600 mx-2">•</span>
                  <span className="text-emerald-400 text-sm font-medium">{pkg.vendorName}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {pkg.features.map((feature: string, idx: number) => (
                    <span key={idx} className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto flex items-end justify-between pt-6 border-t border-slate-800">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Starting from</p>
                    <p className="text-3xl font-black text-white">₹{pkg.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => alert('Tour Package Booking request has been sent! The vendor will contact you with itinerary details.')} className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
