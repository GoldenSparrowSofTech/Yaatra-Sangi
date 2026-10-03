import React from 'react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { slug: 'grand-palace' },
    { slug: 'sunset-resort' },
    { slug: 'mountain-view' }
  ];
}

export default async function HotelMiniWebsite({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // In a real app, you would fetch the hotel data from the API using resolvedParams.slug
  const hotel = {
    name: "The Grand Palace",
    slug: resolvedParams.slug,
    description: "Experience luxury like never before. The Grand Palace offers breathtaking views, world-class dining, and unparalleled comfort in the heart of the city.",
    address: "123 Royal Avenue, Sea Facing Road, Mumbai, India",
    contactPhone: "+91 98765 43210",
    rating: 4.8,
    reviews: 124,
    photos: [
      "https://images.unsplash.com/photo-1542314831-c6a4d27160c1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
    ],
    amenities: ["Free WiFi", "Swimming Pool", "Spa & Wellness", "Restaurant", "Room Service", "Free Parking"],
    rooms: [
      {
        id: 1,
        name: "Deluxe Ocean View",
        description: "Spacious room with a king-size bed and stunning ocean views.",
        capacity: 2,
        basePrice: 4500,
        photos: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80"],
        amenities: ["AC", "TV", "Mini Bar", "Bathtub"]
      },
      {
        id: 2,
        name: "Royal Suite",
        description: "Our finest suite featuring a separate living area, private balcony, and premium services.",
        capacity: 4,
        basePrice: 12000,
        photos: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80"],
        amenities: ["AC", "TV", "Kitchenette", "Jacuzzi", "Butler Service"]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Premium Partner</span>
              <span className="flex items-center text-yellow-400 text-sm font-bold">⭐ {hotel.rating} <span className="text-slate-500 font-normal ml-1">({hotel.reviews} reviews)</span></span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{hotel.name}</h1>
            <p className="text-slate-400 flex items-center gap-2">
              <span>📍</span> {hotel.address}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <span>❤️</span> Save
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <span>📞</span> Contact
            </button>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
          <div className="md:col-span-2 h-full rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${hotel.photos[0]})` }}></div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="h-1/2 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${hotel.photos[1]})` }}></div>
            <div className="h-1/2 rounded-2xl bg-cover bg-center relative" style={{ backgroundImage: `url(${hotel.photos[2]})` }}>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl cursor-pointer hover:bg-black/50 transition-colors">
                <span className="text-white font-bold text-lg">View All Photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">About this Hotel</h2>
              <p className="text-slate-300 leading-relaxed">{hotel.description}</p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-300">
                    <span className="text-indigo-400">✓</span> {amenity}
                  </div>
                ))}
              </div>
            </section>

            {/* Rooms */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Available Rooms</h2>
              <div className="space-y-6">
                {hotel.rooms.map((room) => (
                  <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-48 md:h-auto bg-cover bg-center" style={{ backgroundImage: `url(${room.photos[0]})` }}></div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">{room.name}</h3>
                        <span className="flex items-center gap-1 text-sm text-slate-400"><span>👥</span> Up to {room.capacity} guests</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{room.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {room.amenities.map((am, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">{am}</span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Price per night</p>
                          <p className="text-2xl font-bold text-white">₹ {room.basePrice.toLocaleString()}</p>
                        </div>
                        <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-indigo-600/20">
                          Select Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Booking Widget (Right) */}
          <div className="relative">
            <div className="sticky top-24 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Book Your Stay</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Check In - Check Out</label>
                  <input type="text" placeholder="Select dates" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Guests</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none">
                    <option>1 Room, 2 Adults</option>
                    <option>1 Room, 3 Adults</option>
                    <option>2 Rooms, 4 Adults</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 mb-6">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg mb-4">
                  <p className="text-sm text-green-400 font-medium flex items-start gap-2">
                    <span>💡</span> 
                    <span>Zero Commission Booking! Deal directly with the hotel owner for the best price.</span>
                  </p>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Estimated Price</span>
                  <span className="text-white">₹ 4,500 / night</span>
                </div>
              </div>

              <a 
                href={`https://wa.me/${hotel.contactPhone.replace(/[^0-9]/g, '')}?text=Hello, I am interested in booking a room at ${hotel.name}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-3 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
              >
                <span>💬</span> WhatsApp Owner
              </a>
              
              <a 
                href={`tel:${hotel.contactPhone}`}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>📞</span> Call Hotel
              </a>
              <p className="text-xs text-center text-slate-500 mt-4">No payment required right now</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
