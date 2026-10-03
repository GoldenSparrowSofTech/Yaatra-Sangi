import React from 'react';

export async function generateStaticParams() {
  return [
    { slug: 'royal-cabs' },
    { slug: 'shiv-taxi' },
    { slug: 'premium-rides' }
  ];
}

export default async function TaxiMiniWebsite({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Mock taxi data for demo purposes
  const taxi = {
    name: "Royal Cabs - Innova Crysta",
    slug: resolvedParams.slug,
    description: "Premium outstation and local travel with experienced drivers. Our vehicles are sanitized and equipped with all modern amenities for a comfortable journey.",
    vehicleNumber: "GJ-01-AB-1234",
    modelName: "Toyota Innova Crysta",
    capacity: 7,
    contactPhone: "+91 98765 43210",
    rating: 4.9,
    reviews: 86,
    photos: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80"
    ],
    features: ["AC", "Music System", "Water Bottles", "Charging Ports", "GPS Tracking", "First Aid Kit"],
    pricing: {
      baseFare: 500,
      perKm: 14,
      driverAllowance: 300, // per day
      tollTax: "As applicable",
      stateTax: "As applicable based on borders crossed"
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Verified Taxi</span>
              <span className="flex items-center text-yellow-400 text-sm font-bold">⭐ {taxi.rating} <span className="text-slate-500 font-normal ml-1">({taxi.reviews} reviews)</span></span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{taxi.name}</h1>
            <p className="text-slate-400 flex items-center gap-4">
              <span className="flex items-center gap-1">🚙 {taxi.modelName}</span>
              <span className="flex items-center gap-1">👥 {taxi.capacity} Seats</span>
              <span className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono">{taxi.vehicleNumber}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[350px] md:h-[450px]">
          <div className="md:col-span-2 h-full rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${taxi.photos[0]})` }}></div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="h-1/2 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${taxi.photos[1]})` }}></div>
            <div className="h-1/2 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${taxi.photos[2]})` }}></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">About this Taxi</h2>
              <p className="text-slate-300 leading-relaxed">{taxi.description}</p>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Vehicle Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {taxi.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-slate-300">
                    <span className="text-blue-400">✓</span> {feature}
                  </div>
                ))}
              </div>
            </section>

            {/* Pricing Details */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Fare Details</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-slate-800">
                    <p className="text-sm text-slate-400 mb-1">Per Kilometer Rate</p>
                    <p className="text-3xl font-bold text-white">₹ {taxi.pricing.perKm} <span className="text-lg text-slate-500 font-normal">/km</span></p>
                    <p className="text-xs text-slate-500 mt-2">Minimum billing {taxi.pricing.baseFare} km/day for outstation</p>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-slate-400 mb-1">Driver Allowance</p>
                    <p className="text-3xl font-bold text-white">₹ {taxi.pricing.driverAllowance} <span className="text-lg text-slate-500 font-normal">/day</span></p>
                    <p className="text-xs text-slate-500 mt-2">Night charges may apply after 10 PM</p>
                  </div>
                </div>
                <div className="bg-slate-950 p-6 border-t border-slate-800">
                  <h4 className="text-white font-medium mb-3">Additional Charges:</h4>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex justify-between"><span>Toll Tax & Parking</span> <span className="text-white">{taxi.pricing.tollTax}</span></li>
                    <li className="flex justify-between"><span>State Border Tax</span> <span className="text-white">{taxi.pricing.stateTax}</span></li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Booking Widget (Right) */}
          <div className="relative">
            <div className="sticky top-24 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Book this Taxi</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Trip Type</label>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 rounded-lg text-sm font-medium">Outstation</button>
                    <button className="flex-1 py-2 bg-slate-950 text-slate-400 border border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-800">Local</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Pickup Location</label>
                  <input type="text" placeholder="Enter city or address" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Journey Dates</label>
                  <input type="text" placeholder="Start Date - End Date" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-400 font-medium flex items-start gap-2">
                  <span>💡</span> 
                  <span>Zero Commission Booking! Contact the driver/owner directly to finalize your trip and price.</span>
                </p>
              </div>

              <a 
                href={`https://wa.me/${taxi.contactPhone.replace(/[^0-9]/g, '')}?text=Hello, I want to book your ${taxi.modelName} (${taxi.vehicleNumber}) for a trip.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-3 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
              >
                <span>💬</span> WhatsApp Driver
              </a>
              
              <a 
                href={`tel:${taxi.contactPhone}`}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>📞</span> Call Driver
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
