import React from 'react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [
    { slug: 'goa-4-days' },
    { slug: 'manali-trip' },
    { slug: 'kerala-tour' }
  ];
}

export default async function TourPackageDetails({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const pkg = {
    title: "Goa 4 Days 3 Nights Beach Holiday",
    slug: resolvedParams.slug,
    agentName: "Sunshine Travels",
    destination: "Goa, India",
    duration: "4 Days / 3 Nights",
    price: 8500,
    contactPhone: "+91 98765 22222",
    rating: 4.8,
    reviews: 124,
    includesFood: true,
    includesStay: true,
    includesTravel: false,
    description: "Experience the ultimate beach holiday in Goa. This 4 Days 3 Nights package is carefully curated to give you the perfect blend of relaxation and party. Enjoy stays at premium beachfront properties, daily breakfast and dinner, and an exclusive North Goa sightseeing tour.",
    itinerary: [
      { day: 1, title: "Arrival in Goa & Leisure", desc: "Arrive at Goa airport/station. Transfer to the resort. Spend the evening relaxing at the beach." },
      { day: 2, title: "North Goa Sightseeing", desc: "Visit Aguada Fort, Baga Beach, Calangute Beach, and enjoy water sports." },
      { day: 3, title: "South Goa Tour & Cruise", desc: "Visit Mangueshi Temple, Old Goa Churches, and enjoy the evening Mandovi River Cruise." },
      { day: 4, title: "Departure", desc: "Check out after breakfast and transfer to the airport/station with sweet memories." }
    ],
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560179406-1c6c60e0dcb6?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590050752112-9bd355152a55?auto=format&fit=crop&q=80"
    ]
  };

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <Link href="/tour-packages" className="text-emerald-500 hover:text-emerald-400 mb-6 inline-flex items-center gap-2 transition-colors font-medium">
          <span>←</span> Back to Tour Packages
        </Link>
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header/Cover */}
          <div className="h-[400px] relative overflow-hidden bg-slate-800">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${pkg.image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg w-fit mb-4 shadow-lg flex items-center gap-2">
                <span>⏱️</span> {pkg.duration}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">{pkg.title}</h1>
              <p className="text-xl text-slate-300 flex items-center gap-2">
                <span>📍</span> {pkg.destination}
              </p>
            </div>
          </div>
          
          <div className="p-8 flex flex-col md:flex-row gap-12">
            <div className="flex-1 space-y-10">
              
              <section>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl border-2 border-slate-700">
                    🏢
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Package Provided By</p>
                    <h3 className="text-xl font-bold text-white">{pkg.agentName}</h3>
                  </div>
                  <div className="ml-auto bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-yellow-500">⭐</span> <span className="text-white font-bold">{pkg.rating}</span>
                    <span className="text-slate-500 text-sm"> ({pkg.reviews})</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">Package Overview</h3>
                <p className="text-slate-300 leading-relaxed text-lg">{pkg.description}</p>
              </section>
              
              <section>
                <h3 className="text-2xl font-bold text-white mb-6">What&apos;s Included?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl border ${pkg.includesStay ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'} font-medium flex items-center gap-3`}>
                    <span className="text-2xl">🏨</span> Hotel Stay
                  </div>
                  <div className={`p-4 rounded-xl border ${pkg.includesFood ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'} font-medium flex items-center gap-3`}>
                    <span className="text-2xl">🍽️</span> Daily Meals
                  </div>
                  <div className={`p-4 rounded-xl border ${pkg.includesTravel ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500'} font-medium flex items-center gap-3`}>
                    <span className="text-2xl">✈️</span> Flight/Train
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold text-white mb-6">Day-by-Day Itinerary</h3>
                <div className="space-y-6">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-900 font-bold flex items-center justify-center shrink-0">
                          {day.day}
                        </div>
                        <div className="w-0.5 h-full bg-slate-800 mt-2"></div>
                      </div>
                      <div className="pb-6">
                        <h4 className="text-xl font-bold text-white mb-2">{day.title}</h4>
                        <p className="text-slate-400">{day.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            
            {/* Booking Card */}
            <div className="w-full md:w-80 shrink-0">
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-28">
                <div className="mb-6 pb-6 border-b border-slate-800 text-center">
                  <p className="text-sm text-slate-400 mb-1">Package Price (Per Person)</p>
                  <p className="text-4xl font-bold text-white mb-2">₹{pkg.price}</p>
                  <div className="inline-block bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg">
                    <p className="text-xs text-green-400 font-medium">
                      0% Platform Commission
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-slate-300 text-center mb-4">Contact the agent directly to customize or book this package.</p>
                  
                  <a 
                    href={`https://wa.me/${pkg.contactPhone.replace(/[^0-9]/g, '')}?text=Hello ${pkg.agentName}, I am interested in the ${pkg.title} package.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] shadow-lg shadow-[#25D366]/20"
                  >
                    <span>💬</span> WhatsApp Agent
                  </a>
                  
                  <a 
                    href={`tel:${pkg.contactPhone}`}
                    className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>📞</span> Call Agent
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
