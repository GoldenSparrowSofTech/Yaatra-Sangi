import React from 'react';

export async function generateStaticParams() {
  return [
    { slug: 'gordhan-thal' }
  ];
}

export default async function RestaurantMiniWebsite({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // In a real app, you would fetch the restaurant data from the API using resolvedParams.slug
  const restaurant = {
    name: "Gordhan Thal",
    slug: resolvedParams.slug,
    description: "Experience the authentic taste of Gujarat. We offer an unlimited, royal Gujarati Thali served with traditional warmth and hospitality. Perfect for family dining and celebrations.",
    address: "SG Highway, Thaltej, Ahmedabad, Gujarat",
    contactPhone: "+91 98765 12345",
    cuisineType: "Authentic Gujarati Thali",
    avgCostForTwo: 1200,
    vegOnly: true,
    rating: 4.8,
    reviews: 3200,
    featuredImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
    menuHighlights: [
      "Welcome Drink (Jaljeera / Buttermilk)",
      "4 Types of Farsan (Snacks)",
      "4 Types of Sabzi (Vegetables)",
      "Dal & Kadhi",
      "Phulka Roti & Puri",
      "3 Types of Sweets (Basundi, Shrikhand, Halwa)"
    ]
  };

  return (
    <main className="min-h-screen bg-slate-950 pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${restaurant.featuredImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full px-6 py-12 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            {restaurant.vegOnly && (
              <span className="bg-green-100 border border-green-600 text-green-800 text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div> PURE VEG
              </span>
            )}
            <span className="bg-slate-900/80 backdrop-blur border border-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-lg">
              <span>⭐</span> {restaurant.rating} ({restaurant.reviews} Reviews)
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 shadow-black drop-shadow-xl">{restaurant.name}</h1>
          <p className="text-lg text-slate-300 max-w-2xl flex items-center gap-2">
            <span>📍</span> {restaurant.address}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">About the Restaurant</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              {restaurant.description}
            </p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-slate-800 text-orange-400 rounded-md text-sm border border-slate-700">
                {restaurant.cuisineType}
              </span>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Menu Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {restaurant.menuHighlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-orange-500/50 transition-colors">
                  <span className="text-orange-500">🍲</span>
                  <span className="text-slate-200 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Booking/Contact Widget */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl sticky top-28">
            <div className="mb-6 pb-6 border-b border-slate-800">
              <p className="text-sm text-slate-400 font-medium mb-1">Average Cost</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-white">₹{restaurant.avgCostForTwo}</span>
                <span className="text-slate-500 text-sm mb-1">for two</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Book a Table / Order</h3>
              
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-400 font-medium flex items-start gap-2">
                  <span>💡</span> 
                  <span>Direct Contact! Call or WhatsApp the restaurant directly for reservations or queries without any commission.</span>
                </p>
              </div>

              <a 
                href={`https://wa.me/${restaurant.contactPhone.replace(/[^0-9]/g, '')}?text=Hello, I would like to reserve a table at ${restaurant.name}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-3 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-lg shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
              >
                <span>💬</span> WhatsApp Restaurant
              </a>
              
              <a 
                href={`tel:${restaurant.contactPhone}`}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>📞</span> Call Restaurant
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
