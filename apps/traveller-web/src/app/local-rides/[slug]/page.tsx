import React from 'react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { slug: 'ramesh-bhai' },
    { slug: 'suresh-kumar' },
    { slug: 'vikram-singh' }
  ];
}

export default async function LocalRideDriverProfile({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const driver = {
    name: "Ramesh Bhai",
    slug: resolvedParams.slug,
    vehicleType: "Auto Rickshaw",
    vehicleModel: "Bajaj RE Compact",
    vehicleNumber: "GJ-01-AB-1234",
    city: "Ahmedabad, Gujarat",
    contactPhone: "+91 98765 11111",
    baseFare: 30,
    perKmRate: 15,
    rating: 4.8,
    reviews: 420,
    memberSince: "2023",
    languages: ["Gujarati", "Hindi"],
    description: "Reliable and safe auto rickshaw rides across Ahmedabad. 10+ years of driving experience. Clean auto with comfortable seating.",
    image: "https://images.unsplash.com/photo-1598008851410-a43588df252f?auto=format&fit=crop&q=80",
  };

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/local-rides" className="text-yellow-500 hover:text-yellow-400 mb-8 inline-flex items-center gap-2 transition-colors">
          <span>←</span> Back to Local Rides
        </Link>
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header/Cover */}
          <div className="h-48 relative overflow-hidden bg-slate-800">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: `url(${driver.image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          </div>
          
          {/* Profile Details */}
          <div className="px-8 pb-8 relative -mt-16 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-end gap-4 mb-4">
                <div className="w-32 h-32 bg-slate-800 rounded-2xl border-4 border-slate-900 shadow-xl overflow-hidden flex items-center justify-center text-5xl">
                  🛺
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-white">{driver.name}</h1>
                  <p className="text-yellow-400 font-medium">{driver.vehicleType} • {driver.vehicleModel}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-6 text-sm">
                <span className="bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border border-slate-700">
                  <span className="text-yellow-500">⭐</span> {driver.rating} ({driver.reviews} reviews)
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <span>📍</span> {driver.city}
                </span>
              </div>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-bold text-white mb-2">About Driver</h3>
                  <p className="text-slate-300 leading-relaxed">{driver.description}</p>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold text-white mb-3">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-500 mb-1">Vehicle Number</p>
                      <p className="text-white font-mono font-medium">{driver.vehicleNumber}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-500 mb-1">Languages</p>
                      <p className="text-white font-medium">{driver.languages.join(", ")}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            
            {/* Booking Card */}
            <div className="w-full md:w-80 mt-4 md:mt-16">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-28">
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Base Fare</p>
                    <p className="text-2xl font-bold text-white">₹{driver.baseFare}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Per KM</p>
                    <p className="text-2xl font-bold text-white">₹{driver.perKmRate}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white mb-2">Book Instantly</h3>
                  
                  <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg mb-4">
                    <p className="text-xs text-green-400 font-medium text-center">
                      Direct booking • 0% Commission
                    </p>
                  </div>

                  <a 
                    href={`https://wa.me/${driver.contactPhone.replace(/[^0-9]/g, '')}?text=Hello ${driver.name}, I need a ride.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                  >
                    <span>💬</span> WhatsApp Driver
                  </a>
                  
                  <a 
                    href={`tel:${driver.contactPhone}`}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <span>📞</span> Call Driver
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
