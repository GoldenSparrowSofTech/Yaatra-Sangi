'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackRestaurants = [
    {
      id: 1,
      slug: 'gordhan-thal',
      name: 'Gordhan Thal',
      location: 'Ahmedabad, Gujarat',
      rating: 4.8,
      reviews: 3200,
      avgCostForTwo: 1200,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cuisineType: 'Authentic Gujarati Thali',
      vegOnly: true,
      featured: true,
    },
    {
      id: 2,
      slug: 'punjabi-nature',
      name: 'Punjabi Nature',
      location: 'Rajkot, Gujarat',
      rating: 4.6,
      reviews: 1850,
      avgCostForTwo: 900,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cuisineType: 'North Indian, Punjabi',
      vegOnly: true,
      featured: false,
    },
    {
      id: 3,
      slug: 'the-dass-prakash',
      name: 'The Dass Prakash',
      location: 'Dwarka, Gujarat',
      rating: 4.9,
      reviews: 4200,
      avgCostForTwo: 600,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cuisineType: 'South Indian, Snacks',
      vegOnly: true,
      featured: true,
    },
    {
      id: 4,
      slug: 'kathiyawadi-dhaba',
      name: 'Kathiyawadi Dhaba',
      location: 'Somnath, Gujarat',
      rating: 4.7,
      reviews: 2150,
      avgCostForTwo: 500,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      cuisineType: 'Kathiyawadi, Local',
      vegOnly: true,
      featured: false,
    },
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const url = new URL(`${apiUrl}/restaurants`);
        if (searchQuery) url.searchParams.append('location', searchQuery);
        
        const res = await fetch(url.toString());
        const resList = await res.json();
        
        if (resList && resList.length > 0) {
          setRestaurants(resList);
        } else {
          setRestaurants(fallbackRestaurants);
        }
      } catch (error) {
        console.error("Failed to fetch restaurants", error);
        setRestaurants(fallbackRestaurants);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchRestaurants();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <main 
      className="min-h-screen pt-20 pb-12 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-slate-950/70 z-0"></div>
      
      <div className="relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-md border-b border-slate-800 py-12 px-6">
          <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Discover Best Dining Places</h1>
          
          <div className="bg-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-end shadow-2xl border border-slate-700">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">City or Locality</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to eat?"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Cuisine</label>
              <input 
                type="text" 
                placeholder="e.g. Gujarati, Punjabi"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <button onClick={() => alert('Search applied! Results have been updated below.')} className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-500 transition-colors shadow-lg shadow-orange-600/20 h-[50px] active:scale-95">
              Find Restaurants
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 space-y-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Cost for Two</h3>
            <div className="space-y-3">
              {['₹0 - ₹500', '₹500 - ₹1,000', '₹1,000 - ₹2,000', '₹2,000+'].map((price, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-orange-600 focus:ring-orange-500 focus:ring-offset-slate-950" />
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{price}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Dietary Preference</h3>
            <div className="space-y-3">
              {['Pure Veg', 'Non-Veg Options', 'Jain Options', 'Vegan Friendly'].map((diet, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-orange-600 focus:ring-orange-500 focus:ring-offset-slate-950" />
                  <span className="text-slate-400 group-hover:text-slate-200 transition-colors">{diet}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recommended Restaurants</h2>
            <select className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500">
              <option>Sort by: Popularity</option>
              <option>Rating: High to Low</option>
              <option>Cost: Low to High</option>
              <option>Cost: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {restaurants.filter(r => r.location.toLowerCase().includes(searchQuery.toLowerCase()) || r.name.toLowerCase().includes(searchQuery.toLowerCase())).map((restaurant) => (
              <div key={restaurant.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors group">
                <div className="relative h-56 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${restaurant.image})` }}
                  ></div>
                  {restaurant.featured && (
                    <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Top Rated
                    </div>
                  )}
                  {restaurant.vegOnly && (
                    <div className="absolute top-4 right-4 bg-green-100 border border-green-600 text-green-700 text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1 shadow-lg shadow-green-900/30">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div> Pure Veg
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col h-[calc(100%-14rem)]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">{restaurant.name}</h3>
                      <p className="text-slate-400 text-sm">{restaurant.location}</p>
                    </div>
                    <div className="bg-slate-800 text-white text-sm font-bold px-2 py-1 rounded flex items-center gap-1 border border-slate-700">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      {restaurant.rating}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3 mb-6">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700/50">
                      {restaurant.cuisineType}
                    </span>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-end pt-4 border-t border-slate-800/50">
                    <div>
                      <span className="text-xl font-bold text-white">₹{restaurant.avgCostForTwo}</span>
                      <span className="text-slate-500 text-xs block">for two (approx.)</span>
                    </div>
                    <Link href={`/restaurant/${restaurant.slug}`} className="px-6 py-2.5 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-lg">
                      View details
                    </Link>
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
