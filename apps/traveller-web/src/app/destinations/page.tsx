"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DestinationsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Trending', 'Romantic', 'Adventure', 'Heritage'];

  const fallbackDestinations = [
    {
      id: "1",
      name: "Rajkot",
      state: "Gujarat",
      country: "India",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80",
      rating: 4.5,
      type: "Trending",
      description: "Cultural hub of Saurashtra with amazing food and heritage.",
      placesToVisit: [
        { name: "Rotary Dolls Museum", image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80", description: "Unique museum with dolls from around the world." },
        { name: "Watson Museum", image: "https://images.unsplash.com/photo-1518998053401-878c735c0754?q=80", description: "Excellent collection of human history and culture." }
      ]
    },
    {
      id: "2",
      name: "Dwarka",
      state: "Gujarat",
      country: "India",
      image: "https://images.unsplash.com/photo-1629813358055-6677e81b66b8?q=80",
      rating: 4.9,
      type: "Heritage",
      description: "Ancient sacred city of Lord Krishna.",
      placesToVisit: [
        { name: "Dwarkadhish Temple", image: "https://images.unsplash.com/photo-1629813358055-6677e81b66b8?q=80", description: "Main temple dedicated to Lord Krishna." },
        { name: "Bet Dwarka", image: "https://images.unsplash.com/photo-1580911762111-e630132b49b3?q=80", description: "Island near Dwarka." }
      ]
    },
    {
      id: "3",
      name: "Goa",
      state: "Goa",
      country: "India",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80",
      rating: 4.8,
      type: "Romantic",
      description: "Famous for its beautiful beaches, nightlife, and Portuguese heritage.",
      placesToVisit: [
        { name: "Baga Beach", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80", description: "Popular beach in North Goa." }
      ]
    },
    {
      id: "4",
      name: "Rajasthan",
      state: "Rajasthan",
      country: "India",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80",
      rating: 4.9,
      type: "Heritage",
      description: "The land of kings, famous for massive forts and royal palaces.",
      placesToVisit: [
        { name: "Amber Fort", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80", description: "Majestic fort in Jaipur." }
      ]
    },
    {
      id: "5",
      name: "Kerala",
      state: "Kerala",
      country: "India",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80",
      rating: 4.9,
      type: "Romantic",
      description: "God's Own Country, famous for its backwaters and lush green landscapes.",
      placesToVisit: [
        { name: "Alleppey Backwaters", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80", description: "Beautiful backwaters." }
      ]
    },
    {
      id: "6",
      name: "Agra",
      state: "Uttar Pradesh",
      country: "India",
      image: "https://images.unsplash.com/photo-1564507592227-cb84b196a8ee?q=80",
      rating: 4.7,
      type: "Heritage",
      description: "Home to the iconic Taj Mahal, a symbol of eternal love.",
      placesToVisit: [
        { name: "Taj Mahal", image: "https://images.unsplash.com/photo-1564507592227-cb84b196a8ee?q=80", description: "Wonder of the World." }
      ]
    },
    {
      id: "7",
      name: "Manali",
      state: "Himachal Pradesh",
      country: "India",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80",
      rating: 4.8,
      type: "Adventure",
      description: "A high-altitude Himalayan resort town known for snow and trails.",
      placesToVisit: [
        { name: "Solang Valley", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80", description: "Adventure sports." }
      ]
    },
    {
      id: "8",
      name: "Andaman",
      state: "Andaman",
      country: "India",
      image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80",
      rating: 4.9,
      type: "Trending",
      description: "Pristine beaches, crystal clear waters, and world-class scuba diving.",
      placesToVisit: [
        { name: "Radhanagar Beach", image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80", description: "Asia's best beach." }
      ]
    }
  ];

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    fetch(`${apiUrl}/destinations`)
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setDestinations(data);
        } else {
          setDestinations(fallbackDestinations);
        }
      })
      .catch(() => {
        setDestinations(fallbackDestinations);
      })
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
