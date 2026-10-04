'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapComponent to prevent SSR window errors
const MapComponent = dynamic(() => import('../../components/MapComponent'), { ssr: false });

export interface Location {
  name: string;
  lat: number;
  lon: number;
}

export default function PlanTripPage() {
  const [destinations, setDestinations] = useState<Location[]>([
    { name: 'Rajkot', lat: 22.3039, lon: 70.8022 },
    { name: 'Dwarka', lat: 22.2442, lon: 68.9685 },
    { name: 'Somnath', lat: 20.8880, lon: 70.4012 }
  ]);
  const [newCity, setNewCity] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Debounced Search using Nominatim API (OpenStreetMap)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (newCity.trim().length > 2) {
        setIsSearching(true);
        try {
          // 1. Try our Backend API
          let results: Location[] = [];
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            const beResponse = await fetch(`${apiUrl}/destinations?search=${newCity}`);
            if (beResponse.ok) {
               const beData = await beResponse.json();
               results = beData.map((item: any) => ({
                 name: item.name,
                 lat: item.latitude,
                 lon: item.longitude
               }));
            }
          } catch(e) {
            console.error("Backend fetch error", e);
          }

          // 2. Fallback to OpenStreetMap if backend has no results
          if (results.length === 0) {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${newCity}&countrycodes=in&limit=5&featuretype=city`, {
              headers: { 'User-Agent': 'YatraSangiTravelApp/1.0' }
            });
            const data = await response.json();
            results = data.map((item: any) => ({
              name: item.display_name.split(',')[0], // Extract just the city name
              lat: parseFloat(item.lat),
              lon: parseFloat(item.lon)
            }));
            
            // Optionally, we could save the newly discovered cities to our backend here
          }
          // Filter duplicates by name
          const unique = results.filter((v: any, i: any, a: any) => a.findIndex((t: any) => (t.name === v.name)) === i);
          setSuggestions(unique);
          setFocusedIndex(-1);
        } catch (error) {
          console.error("Error fetching cities", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setFocusedIndex(-1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [newCity]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCity(e.target.value);
  };

  const handleFocus = () => {
    if (newCity.trim().length === 0) {
      setSuggestions([
        { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
        { name: 'Delhi', lat: 28.7041, lon: 77.1025 },
        { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
      ]);
      setFocusedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && suggestions.length > focusedIndex) {
        selectCity(suggestions[focusedIndex]);
      } else if (suggestions.length > 0) {
        selectCity(suggestions[0]);
      }
    }
  };

  const selectCity = (city: Location) => {
    setDestinations([...destinations, city]);
    setNewCity('');
    setSuggestions([]);
    setFocusedIndex(-1);
  };

  const removeDestination = (index: number) => {
    setDestinations(destinations.filter((_, i) => i !== index));
  };

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);

  // Haversine formula to calculate distance in km
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleOptimize = () => {
    if (destinations.length < 2) {
      alert("Please add at least 2 destinations to optimize a route.");
      return;
    }

    setIsOptimizing(true);
    setRouteResult(null);

    // AI Route Optimization (Nearest Neighbor + 2-Opt Algorithm)
    setTimeout(async () => {
      let unvisited = [...destinations.slice(1)];
      let optimized = [destinations[0]];
      let current = destinations[0];

      // Check if it's a round trip (starting city added again anywhere)
      let isRoundTrip = false;
      let startNodeCopy = null;

      const startName = destinations[0].name.toLowerCase().trim();
      const duplicateIndex = unvisited.findIndex(d => d.name.toLowerCase().trim() === startName);

      if (duplicateIndex !== -1) {
        isRoundTrip = true;
        startNodeCopy = unvisited[duplicateIndex];
        unvisited.splice(duplicateIndex, 1);
      }

      // Step 1: Nearest Neighbor (Greedy)
      while (unvisited.length > 0) {
        let nearestIdx = 0;
        let minDistance = Infinity;

        for (let i = 0; i < unvisited.length; i++) {
          const d = getDistance(current.lat, current.lon, unvisited[i].lat, unvisited[i].lon);
          if (d < minDistance) {
            minDistance = d;
            nearestIdx = i;
          }
        }
        current = unvisited[nearestIdx];
        optimized.push(current);
        unvisited.splice(nearestIdx, 1);
      }

      // Step 2: 2-Opt Algorithm to untangle crossings (fixes the Dwarka jump)
      const calculateRouteDist = (route: typeof destinations) => {
        let dist = 0;
        for (let i = 0; i < route.length - 1; i++) {
          dist += getDistance(route[i].lat, route[i].lon, route[i + 1].lat, route[i + 1].lon);
        }
        return dist;
      };

      let improved = true;
      let bestDistance = calculateRouteDist(optimized);

      while (improved) {
        improved = false;
        // Don't swap the starting point (index 0)
        for (let i = 1; i < optimized.length - 1; i++) {
          for (let j = i + 1; j < optimized.length; j++) {
            const newRoute = [
              ...optimized.slice(0, i),
              ...optimized.slice(i, j + 1).reverse(),
              ...optimized.slice(j + 1)
            ];
            const newDistance = calculateRouteDist(newRoute);

            if (newDistance < bestDistance - 0.001) { // 0.001 to prevent float precision infinite loops
              optimized = newRoute;
              bestDistance = newDistance;
              improved = true;
            }
          }
        }
      }

      // Add the return point at the very end if it's a circular route
      if (isRoundTrip && startNodeCopy) {
        optimized.push(startNodeCopy);
        bestDistance += getDistance(optimized[optimized.length - 2].lat, optimized[optimized.length - 2].lon, startNodeCopy.lat, startNodeCopy.lon);
      }

      setDestinations(optimized);

      // Now fetch real driving route from OSRM
      try {
        const coords = optimized.map(c => `${c.lon},${c.lat}`).join(';');
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`);
        const data = await res.json();
        
        if (data.code === 'Ok') {
          const distanceKm = data.routes[0].distance / 1000;
          const timeHours = data.routes[0].duration / 3600;
          const taxiCost = Math.round(distanceKm * 12); // Assume ₹12 per km

          setRouteResult({
            distance: `${Math.round(distanceKm)} km`,
            time: `${Math.floor(timeHours)} hrs ${Math.round((timeHours % 1) * 60)} mins`,
            stops: optimized.length,
            cost: `₹ ${taxiCost.toLocaleString('en-IN')}`
          });
        } else {
          throw new Error('OSRM failed');
        }
      } catch (err) {
        // Fallback to straight-line if API fails
        const timeHours = Math.round((bestDistance / 60) * 10) / 10;
        const taxiCost = Math.round(bestDistance * 12);
        setRouteResult({
          distance: `~${Math.round(bestDistance)} km (Straight line)`,
          time: `${Math.floor(timeHours)} hrs ${Math.round((timeHours % 1) * 60)} mins`,
          stops: optimized.length,
          cost: `₹ ${taxiCost.toLocaleString('en-IN')}`
        });
      }
      setIsOptimizing(false);
    }, 500); // reduced timeout since we do API call
  };

  return (
    <main 
      className="min-h-screen flex flex-col md:flex-row pt-20 relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-slate-950/60 z-0"></div>

      {/* Left Sidebar: Itinerary Planner */}
      <div className="w-full md:w-1/3 border-r border-slate-800/50 bg-slate-900/30 p-6 flex flex-col h-[calc(100vh-80px)] overflow-y-auto relative z-10 backdrop-blur-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Build Itinerary</h1>
          <p className="text-slate-400 text-sm">Add cities and let our AI optimize the route.</p>
        </div>

        {/* Input Form */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col gap-2 relative z-0">
            {/* Vertical dashed line connector */}
            {destinations.length > 1 && (
              <div className="absolute left-4 top-10 bottom-4 w-[2px] border-l-2 border-dashed border-slate-700 z-0"></div>
            )}

            {destinations.map((city, index) => (
              <div key={index} className="relative z-10">
                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">
                  {index === 0 ? 'Starting Point' : `Stop ${index}`}
                </label>
                <div className="bg-slate-950/50 backdrop-blur-sm border border-slate-800/50 rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="text-slate-200 font-medium">{city.name}</span>
                  <button onClick={() => removeDestination(index)} className="text-slate-600 hover:text-red-400 font-bold text-lg">&times;</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 relative z-50 mt-4">
            <label className="block text-xs font-medium text-indigo-400 mb-1 uppercase tracking-wider">
              {destinations.length === 0 ? 'Add Starting Point' : 'Add Next Destination'}
            </label>
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={newCity}
                onChange={handleCityChange}
                onFocus={handleFocus}
                onBlur={() => setTimeout(() => { setSuggestions([]); setFocusedIndex(-1); }, 200)}
                onKeyDown={handleKeyDown}
                placeholder={destinations.length === 0 ? "e.g. Mumbai" : "Search any city in India..."}
                className="w-full bg-slate-950/50 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
              />
              <button
                onClick={() => {
                  if (suggestions.length > 0) selectCity(suggestions[focusedIndex >= 0 ? focusedIndex : 0]);
                }}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shadow-md shadow-indigo-600/20 flex items-center justify-center min-w-[80px]"
              >
                {isSearching ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Add'}
              </button>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-[calc(100%-100px)] mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto">
                  {suggestions.map((city, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectCity(city)}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-700/50 last:border-0 ${focusedIndex === idx
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-200 hover:bg-slate-700'
                        }`}
                    >
                      {city.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-6 border-t border-slate-800">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isOptimizing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            )}
            {isOptimizing ? 'Optimizing AI Route...' : 'Optimize Route'}
          </button>
        </div>
      </div>

      {/* Right Side: Map Area */}
      <div className="w-full md:w-2/3 h-[50vh] md:h-[calc(100vh-80px)] relative overflow-hidden p-6 lg:p-8">
        {/* Render Map inside a padded container */}
        <div className="w-full h-full relative z-0 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50">
          <MapComponent destinations={destinations} />
        </div>

        {routeResult && (
          <div className="absolute top-12 right-12 z-[400] flex flex-col">
            <div className="bg-slate-900/95 border border-indigo-500/50 p-6 rounded-2xl w-[320px] shadow-2xl shadow-indigo-500/20 backdrop-blur-md">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-center text-white mb-1">Route Optimized!</h2>
              <p className="text-center text-slate-400 text-sm mb-6">Best path for {routeResult.stops} locations.</p>

              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-500 text-sm">Total Distance</span>
                  <span className="text-white font-medium text-sm">{routeResult.distance}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-500 text-sm">Travel Time</span>
                  <span className="text-white font-medium text-sm">{routeResult.time}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-500 text-sm">Taxi Estimate</span>
                  <span className="text-green-400 font-bold text-sm">{routeResult.cost}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <Link href={`/hotels?search=${destinations.map(d => encodeURIComponent(d.name)).join(',')}`} className="w-full py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-500 transition-colors text-center shadow-lg shadow-indigo-600/20">
                  Find Hotels on Route
                </Link>
                <Link href={`/taxi?search=${destinations.map(d => encodeURIComponent(d.name)).join(',')}`} className="w-full py-2.5 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors border border-slate-700 text-center flex items-center justify-center">
                  Book Taxi
                </Link>
                <a href={`https://www.google.com/maps/dir/${destinations.map(d => encodeURIComponent(d.name)).join('/')}`} target="_blank" rel="noreferrer" className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-500 transition-colors text-center shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                  <span>🌍</span> Open in Google Maps
                </a>
                <button
                  onClick={() => setRouteResult(null)}
                  className="w-full py-2 bg-transparent text-slate-400 text-xs font-medium rounded-lg hover:text-white transition-colors mt-1"
                >
                  Close & Edit Route
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
