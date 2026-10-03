'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hotels, setHotels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackHotels = [
    {
      id: 1,
      name: 'The Leela Palace',
      location: 'Udaipur, Rajasthan',
      rating: 4.9,
      reviews: 1240,
      price: 18500,
      image: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Pool', 'Spa', 'Lake View', 'Free WiFi'],
      featured: true,
    },
    {
      id: 2,
      name: 'Taj Mahal Tower',
      location: 'Mumbai, Maharashtra',
      rating: 4.8,
      reviews: 3200,
      price: 15200,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Sea View', 'Gym', 'Restaurant', 'Bar'],
      featured: false,
    },
    {
      id: 3,
      name: 'Rambagh Palace',
      location: 'Jaipur, Rajasthan',
      rating: 4.9,
      reviews: 890,
      price: 22000,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Heritage Property', 'Pool', 'Spa', 'Fine Dining'],
      featured: true,
    },
    {
      id: 4,
      name: 'ITC Maurya',
      location: 'New Delhi, Delhi',
      rating: 4.7,
      reviews: 1560,
      price: 12000,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c0d589rx?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Pool', 'Spa', 'City Center', 'Bukhara'],
      featured: false,
    },
    {
      id: 5,
      name: 'Ahilya Fort Heritage',
      location: 'Maheshwar, MP',
      rating: 4.8,
      reviews: 450,
      price: 14500,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['River View', 'Heritage', 'Pool', 'Nature'],
      featured: false,
    },
    {
      id: 6,
      name: 'Evolve Back',
      location: 'Coorg, Karnataka',
      rating: 4.9,
      reviews: 2100,
      price: 19000,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: ['Plantation', 'Private Pool', 'Ayurveda', 'Trekking'],
      featured: true,
    }
  ];

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:3004/hotels');
        const hotelList = await res.json();
        
        if (hotelList && hotelList.length > 0) {
          
          // Basic client-side search filtering
          if (searchQuery) {
            const filtered = hotelList.filter((h: any) => 
              h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
              h.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setHotels(filtered);
          } else {
            setHotels(hotelList);
          }
        } else {
          // Fallback to mock data if database is empty for the demo
          setHotels(fallbackHotels);
        }
      } catch (error) {
        console.error("Failed to fetch hotels", error);
        setHotels(fallbackHotels);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchHotels();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <main 
      className="min-h-screen pt-20 pb-12 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-slate-950/60 z-0"></div>
      
      <div className="relative z-10">
        {/* Search Header */}
        <div className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 py-12 px-6">
          <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Find Your Perfect Stay</h1>
          
          <div className="bg-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-2xl border border-slate-700">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Destination</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where are you going?"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Check In - Check Out</label>
              <input 
                type="text" 
                placeholder="Select Dates"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Guests & Rooms</label>
              <input 
                type="text" 
                placeholder="2 Guests, 1 Room"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 h-[50px]">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4 space-y-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Price Range</h3>
            <div className="space-y-3">
              {['₹0 - ₹2,000', '₹2,000 - ₹5,000', '₹5,000 - ₹10,000', '₹10,000+'].map((price, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950" />
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{price}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Star Rating</h3>
            <div className="space-y-3">
              {[5, 4, 3].map((star, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950" />
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors flex gap-1">
                    {Array(star).fill(0).map((_, idx) => (
                      <svg key={idx} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recommended Hotels</h2>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Highest Rated</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {hotels.filter(h => h.location.toLowerCase().includes(searchQuery.toLowerCase()) || h.name.toLowerCase().includes(searchQuery.toLowerCase())).map((hotel) => (
              <div key={hotel.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group">
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${hotel.image})` }}
                  ></div>
                  {hotel.featured && (
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Recommended
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white text-sm font-bold px-2 py-1 rounded flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    {hotel.rating}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col h-[calc(100%-14rem)]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{hotel.name}</h3>
                      <p className="text-slate-400 text-sm">{hotel.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3 mb-6">
                    {hotel.amenities && hotel.amenities.map((amenity: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700/50">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-auto flex justify-between items-end pt-4 border-t border-slate-800/50">
                    <div>
                      <span className="text-2xl font-bold text-white">₹{hotel.price.toLocaleString('en-IN')}</span>
                      <span className="text-slate-500 text-xs block">/ night + taxes</span>
                    </div>
                    <button className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-lg">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
