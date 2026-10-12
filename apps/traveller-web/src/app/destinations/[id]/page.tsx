import React from 'react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { id: 'goa' },
    { id: 'udaipur' },
    { id: 'manali' },
    { id: 'kerala' },
    { id: 'jaipur' },
    { id: 'leh' },
    { id: 'agra' },
    { id: 'varanasi' },
    { id: 'shimla' }
  ];
}

// Fetch data from the NestJS API
async function getDestinationData(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/destinations/${id}`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    
    // Offline Fallback data mapped by ID
    const fallbacks: Record<string, any> = {
      '1': { name: 'Rajkot', description: 'Cultural hub of Saurashtra with amazing food and heritage.', placesToVisit: [{name: 'Rotary Dolls Museum', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80', description: 'Unique museum'}] },
      '2': { name: 'Dwarka', description: 'Ancient sacred city of Lord Krishna.', placesToVisit: [{name: 'Dwarkadhish Temple', image: 'https://images.unsplash.com/photo-1629813358055-6677e81b66b8?q=80', description: 'Main temple'}] },
      '3': { name: 'Goa', description: 'Famous for its beautiful beaches, nightlife, and Portuguese heritage.' },
      '4': { name: 'Rajasthan', description: 'The land of kings, famous for massive forts and royal palaces.' },
      '5': { name: 'Kerala', description: 'Gods Own Country, famous for its backwaters.' },
      '6': { name: 'Agra', description: 'Home to the iconic Taj Mahal.' },
      '7': { name: 'Manali', description: 'A high-altitude Himalayan resort town.' },
      '8': { name: 'Andaman', description: 'Pristine beaches, crystal clear waters.' },
      'goa': { name: 'Goa', description: 'Famous for its beautiful beaches, nightlife, and Portuguese heritage.' }
    };
    
    if (fallbacks[id]) {
      return { ...fallbacks[id], placesToVisit: fallbacks[id].placesToVisit || [], hotels: [], tours: [] };
    }

    // Fallback data if API is down
    const name = id.charAt(0).toUpperCase() + id.slice(1);
    return {
      name,
      description: `Discover the best experiences, hotels, and tour packages for ${name}.`,
      placesToVisit: [],
      hotels: [],
      tours: []
    };
  }
}

export default async function DestinationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getDestinationData(id);
  const name = data.name || id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <main 
      className="min-h-screen pt-24 pb-16 relative bg-slate-950"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.9), rgba(2, 6, 23, 1)), url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-12">
          <Link href="/destinations" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium mb-6 transition-colors">
            <span className="mr-2">&larr;</span> Back to Destinations
          </Link>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{name}</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl font-light">
            {data.description}
          </p>
        </div>

        {/* Places to Visit */}
        {data.placesToVisit && data.placesToVisit.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Top Places to Visit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.placesToVisit.map((place: any, index: number) => (
                <div key={index} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${place.image})` }}></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{place.name}</h3>
                    <p className="text-slate-300 text-sm">{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Hotels */}
        {data.hotels && data.hotels.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Top Hotels in {name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.hotels.map((hotel: any) => (
                <div key={hotel.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${hotel.image})` }}></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{hotel.name}</h3>
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="text-emerald-400 font-semibold">{hotel.price}</span>
                      <span className="flex items-center text-yellow-400 text-sm">⭐ {hotel.rating}</span>
                    </div>
                    <button className="mt-4 w-full py-2 bg-slate-800 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tour Packages */}
        {data.tours && data.tours.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Popular Tour Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.tours.map((tour: any) => (
                <div key={tour.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${tour.image})` }}></div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{tour.name}</h3>
                    <div className="flex justify-between items-center text-slate-300 text-sm">
                      <span>⏱️ {tour.duration}</span>
                      <span className="text-emerald-400 font-semibold text-lg">{tour.price}</span>
                    </div>
                    <button className="mt-4 w-full py-2 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-white rounded-lg transition-colors text-sm font-medium">View Itinerary</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
