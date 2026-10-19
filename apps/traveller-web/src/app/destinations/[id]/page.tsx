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
    const res = await fetch(`${apiUrl}/destinations/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    // Offline Fallback data mapped by ID/slug for standalone web/mobile
    const fallbacks: Record<string, any> = {
      'goa': {
        name: 'Goa',
        description: 'Famous for its pristine beaches, vibrant nightlife, water sports, and Portuguese architecture.',
        placesToVisit: [
          { name: 'Baga Beach', description: 'Famous for water sports and vibrant nightlife.', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80' },
          { name: 'Dudhsagar Falls', description: 'Majestic four-tiered waterfall.', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80' }
        ],
        hotels: [{ name: 'Taj Exotica Resort', price: '₹18,000/night', rating: 4.8 }],
        tours: [{ name: 'South Goa Sightseeing', price: '₹1,200', duration: 'Full Day' }]
      },
      'udaipur': {
        name: 'Udaipur',
        description: 'The City of Lakes, known for its royal palaces, heritage forts, and tranquil boat cruises.',
        placesToVisit: [
          { name: 'City Palace', description: 'Monumental complex overlooking Lake Pichola.', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80' }
        ],
        hotels: [{ name: 'Taj Lake Palace', price: '₹45,000/night', rating: 4.9 }],
        tours: [{ name: 'City Palace Tour', price: '₹2,500', duration: 'Half Day' }]
      },
      'manali': {
        name: 'Manali',
        description: 'A high-altitude Himalayan valley town famous for snow peaks, Solang adventure, and Beas river.',
        placesToVisit: [
          { name: 'Solang Valley', description: 'Hub for paragliding and snow adventure.', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80' }
        ],
        hotels: [{ name: 'The Himalayan Resort', price: '₹12,000/night', rating: 4.7 }],
        tours: [{ name: 'Solang Valley Tour', price: '₹1,800', duration: 'Full Day' }]
      },
      'kerala': {
        name: 'Kerala',
        description: "God's Own Country, famed for tranquil backwaters, palm-fringed houseboats, and lush tea gardens.",
        placesToVisit: [
          { name: 'Alleppey Backwaters', description: 'Serene backwater houseboats.', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80' }
        ],
        hotels: [{ name: 'Kumarakom Lake Resort', price: '₹22,000/night', rating: 4.9 }],
        tours: [{ name: 'Houseboat Day Cruise', price: '₹6,000', duration: 'Full Day' }]
      },
      'jaipur': {
        name: 'Jaipur',
        description: 'The Pink City of India, world-renowned for Amer Fort, Hawa Mahal, and royal heritage.',
        placesToVisit: [
          { name: 'Hawa Mahal', description: 'Palace of Winds with honeycomb facade.', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80' }
        ],
        hotels: [{ name: 'Rambagh Palace', price: '₹48,000/night', rating: 4.9 }],
        tours: [{ name: 'Royal Forts Tour', price: '₹2,200', duration: 'Full Day' }]
      },
      'leh': {
        name: 'Leh Ladakh',
        description: 'Land of high passes, ancient Buddhist monasteries, and crystal blue Pangong Lake.',
        placesToVisit: [
          { name: 'Pangong Tso', description: 'High altitude vibrant blue lake.', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80' }
        ],
        hotels: [{ name: 'The Grand Dragon', price: '₹16,000/night', rating: 4.7 }],
        tours: [{ name: 'Pangong Lake Expedition', price: '₹14,000', duration: '3 Days' }]
      },
      'agra': {
        name: 'Agra',
        description: 'Home of the timeless Taj Mahal and Mughal grandeur on the banks of Yamuna.',
        placesToVisit: [
          { name: 'Taj Mahal', description: 'World Wonder ivory-white marble monument.', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80' }
        ],
        hotels: [{ name: 'The Oberoi Amarvilas', price: '₹42,000/night', rating: 4.9 }],
        tours: [{ name: 'Sunrise Taj Tour', price: '₹1,500', duration: 'Half Day' }]
      },
      'varanasi': {
        name: 'Varanasi',
        description: 'The spiritual capital of India, sacred Ganga ghats, and divine evening aarti rituals.',
        placesToVisit: [
          { name: 'Dashashwamedh Ghat', description: 'Iconic ghat of Ganga Aarti.', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80' }
        ],
        hotels: [{ name: 'BrijRama Palace', price: '₹26,000/night', rating: 4.8 }],
        tours: [{ name: 'Ganga Boat Ride', price: '₹1,200', duration: '3 Hours' }]
      },
      'shimla': {
        name: 'Shimla',
        description: 'Queen of Hill Stations, featuring Victorian architecture, Mall Road, and pine forests.',
        placesToVisit: [
          { name: 'The Ridge & Mall Road', description: 'Scenic pedestrian promenade.', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80' }
        ],
        hotels: [{ name: 'Wildflower Hall', price: '₹32,000/night', rating: 4.9 }],
        tours: [{ name: 'Kufri Day Tour', price: '₹2,800', duration: 'Full Day' }]
      }
    };
    
    if (fallbacks[id.toLowerCase()]) {
      return fallbacks[id.toLowerCase()];
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
