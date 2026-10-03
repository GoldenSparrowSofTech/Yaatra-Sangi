'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TaxiPage() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [taxis, setTaxis] = useState<any[]>([]);

  const fallbackTaxis = [
    { id: '1', slug: 'royal-cabs', name: 'Royal Cabs', type: 'SUV (Innova)', location: 'Delhi NCR', rating: 4.8, price: 15, perKm: true, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80' },
    { id: '2', slug: 'shiv-taxi', name: 'Shiv Taxi Service', type: 'Sedan (Dzire)', location: 'Mumbai', rating: 4.6, price: 12, perKm: true, image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80' },
  ];

  const fetchTaxis = async () => {
    try {
      const res = await fetch('http://localhost:3004/taxis');
      const taxiList = await res.json();
      
      if (taxiList && taxiList.length > 0) {
        
        if (pickup || dropoff) {
          const filtered = taxiList.filter((t: any) => 
            t.location.toLowerCase().includes(pickup.toLowerCase()) || 
            t.location.toLowerCase().includes(dropoff.toLowerCase())
          );
          setTaxis(filtered);
        } else {
          setTaxis(taxiList);
        }
      } else {
        setTaxis(fallbackTaxis);
      }
    } catch (error) {
      console.error("Failed to fetch taxis", error);
      setTaxis(fallbackTaxis);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchTaxis();
  }, []);

  const handleSearch = () => {
    fetchTaxis();
  };

  return (
    <main 
      className="min-h-screen pt-20 pb-12 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-slate-950/75 z-0"></div>
      
      <div className="relative z-10">
        {/* Search Header */}
        <div className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">Book Your Ride</h1>
          
          <div className="bg-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-2xl border border-slate-700">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Pickup Location</label>
              <input 
                type="text" 
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="e.g. Airport, Hotel, City"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Drop-off Location</label>
              <input 
                type="text" 
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                placeholder="e.g. Destination City"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Date & Time</label>
              <input 
                type="datetime-local" 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button onClick={handleSearch} className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 h-[50px]">
              Find Cabs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <h2 className="text-2xl font-bold text-white mb-8">Available Vehicles</h2>

        <div className="space-y-6">
          {taxis.map((taxi) => (
            <div key={taxi.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors flex flex-col md:flex-row group">
              <div className="w-full md:w-1/3 relative h-48 md:h-auto bg-slate-800">
                <div 
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${taxi.image})` }}
                ></div>
                {taxi.recommended && (
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Best Value
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{taxi.type}</h3>
                      <p className="text-slate-400">{taxi.model}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">₹{taxi.price.toLocaleString('en-IN')}</span>
                      <span className="text-slate-500 text-xs block">Estimated Fare</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 mt-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                      {taxi.capacity}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      {taxi.bags}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {taxi.features && taxi.features.map((feature: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700/50">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-lg">
                    Select Vehicle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </main>
  );
}
