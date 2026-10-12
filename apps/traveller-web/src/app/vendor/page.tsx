'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

export default function VendorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isRegistered, setIsRegistered] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [incomingRides, setIncomingRides] = useState<any[]>([]);
  const [vendorId] = useState('driver-001'); // Mock vendor ID

  useEffect(() => {
    if (isRegistered) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const newSocket = io(apiUrl);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Vendor connected to WebSocket');
        newSocket.emit('driver_online', { driverId: vendorId });
      });

      newSocket.on('new_ride_request', (ride) => {
        console.log('New ride received:', ride);
        setIncomingRides(prev => [...prev, ride]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isRegistered, vendorId]);

  const acceptRide = (bookingId: string) => {
    if (socket) {
      socket.emit('accept_ride', { bookingId, driverId: vendorId });
      
      // Listen for success or failure just for this booking
      socket.once('ride_accepted_success', (confirmedBooking) => {
        alert('You successfully accepted the ride!');
        setIncomingRides(prev => prev.filter(r => r.id !== bookingId));
      });
      socket.once('ride_accepted_failed', (data) => {
        alert('Failed to accept: ' + data.message);
        setIncomingRides(prev => prev.filter(r => r.id !== bookingId));
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col md:flex-row pt-20"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950/80 backdrop-blur-md border-r border-slate-800 p-6 flex flex-col">
        {/* Navigation Actions */}
        <div className="flex gap-2 mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/50 hover:bg-slate-800 text-slate-300 text-sm font-medium py-2 rounded-lg border border-slate-700/50 transition-colors shadow-sm"
          >
            ← Back
          </button>
          <Link 
            href="/"
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900/50 hover:bg-slate-800 text-slate-300 text-sm font-medium py-2 rounded-lg border border-slate-700/50 transition-colors shadow-sm"
          >
            🏠 Home
          </Link>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Partner Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage your business</p>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('hotel')}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'hotel' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            🏨 My Hotel & Rooms
          </button>
          <button 
            onClick={() => setActiveTab('taxi')}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'taxi' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            🚕 My Taxis & Rates
          </button>
          <button 
            onClick={() => setActiveTab('restaurant')}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'restaurant' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            🍽️ My Restaurants
          </button>
          <button 
            onClick={() => setActiveTab('local-ride')}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'local-ride' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            🛺 My Local Rides
          </button>
          <button 
            onClick={() => setActiveTab('tour-package')}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tour-package' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            🌴 My Tour Packages
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bookings' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            📅 Bookings
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              RP
            </div>
            <div>
              <p className="text-sm font-bold text-white">Raj Patel</p>
              <p className="text-xs text-slate-500">Business Owner</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Raj! 👋</h1>
            <p className="text-slate-400 mb-8">Here is what is happening with your properties today.</p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-full -z-0"></div>
                <p className="text-sm font-medium text-slate-400">Subscription Status</p>
                <p className="text-2xl font-bold text-white mt-2">ACTIVE</p>
                <p className="text-xs text-yellow-400 mt-2 font-medium">Valid until: 31 Dec 2027</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <p className="text-sm font-medium text-slate-400">Direct Inquiries</p>
                <p className="text-3xl font-bold text-white mt-2">48</p>
                <p className="text-xs text-green-400 mt-2 font-medium">WhatsApp / Calls this month</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <p className="text-sm font-medium text-slate-400">Active Listings</p>
                <p className="text-3xl font-bold text-white mt-2">6</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">1 Hotel, 2 Taxis, 1 Restaurant, 1 Auto, 1 Package</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-3xl">🚀</div>
              <h3 className="text-xl font-bold text-white mb-2">Ready to grow?</h3>
              <p className="text-slate-400 max-w-md mx-auto mb-6">Add new rooms to your hotel or list a new taxi to increase your earnings.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button onClick={() => setActiveTab('hotel')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20">Manage Hotel</button>
                <button onClick={() => setActiveTab('taxi')} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700">Manage Taxis</button>
                <button onClick={() => setActiveTab('restaurant')} className="px-6 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 rounded-lg font-medium transition-colors border border-orange-500/30">Manage Restaurants</button>
                <button onClick={() => setActiveTab('local-ride')} className="px-6 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 rounded-lg font-medium transition-colors border border-yellow-500/30">Manage Local Rides</button>
                <button onClick={() => setActiveTab('tour-package')} className="px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg font-medium transition-colors border border-emerald-500/30">Manage Packages</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotel' && !isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Partner Registration</h1>
                <p className="text-slate-400">First-time login. Please provide basic details to create your account.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Create Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Owner Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Business Name (Optional)</label>
                    <input type="text" placeholder="e.g. The Grand Palace" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Email Address</label>
                    <input type="email" placeholder="owner@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Mobile Number</label>
                    <input type="text" placeholder="+91 00000 00000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Password</label>
                    <input type="password" placeholder="Create a strong password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setIsRegistered(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-600/20 transition-all">
                    Register & Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotel' && isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Hotel Dashboard</h1>
                <p className="text-slate-400">Manage your property, verify documents, and set pricing.</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20">
                + Add Room Type
              </button>
            </div>

            <div className="space-y-8">
              {/* Document Upload & Verification Section */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Hotel Details & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Hotel Name</label>
                      <input type="text" placeholder="e.g. The Grand Palace" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Address / Location</label>
                      <textarea rows={2} placeholder="Full address" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"></textarea>
                    </div>
                  </div>

                  {/* Documents Upload */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">📸</span>
                      <p className="text-sm text-white font-medium">Hotel Photos</p>
                      <p className="text-xs text-slate-500 mt-1">Upload Exterior/Interior</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">📄</span>
                      <p className="text-sm text-white font-medium">Trade License</p>
                      <p className="text-xs text-slate-500 mt-1">Municipal/Govt License</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">🧾</span>
                      <p className="text-sm text-white font-medium">GST Certificate</p>
                      <p className="text-xs text-slate-500 mt-1">For Tax Verification</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">🆔</span>
                      <p className="text-sm text-white font-medium">Owner ID Proof</p>
                      <p className="text-xs text-slate-500 mt-1">Aadhar / PAN Card</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg transition-all">
                    Submit Documents
                  </button>
                </div>
              </div>

              {/* Pricing & Terms Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Default Policies</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Check-in / Check-out Time</label>
                      <input type="text" placeholder="e.g. 12:00 PM / 10:00 AM" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Cancellation Policy</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                        <option>Free Cancellation before 24 Hours</option>
                        <option>Non-Refundable</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">House Rules</h3>
                  <p className="text-xs text-slate-400 mb-3">Add rules for guests (e.g. unmarried couples allowed, smoking policy).</p>
                  <textarea rows={4} placeholder="- Unmarried couples allowed&#10;- No smoking in rooms&#10;- Pets not allowed" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'taxi' && !isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Partner Registration</h1>
                <p className="text-slate-400">First-time login. Please provide basic details to create your account.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Registration Form */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Create Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Owner Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Business Name (Optional)</label>
                    <input type="text" placeholder="e.g. Patel Travels" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Email Address</label>
                    <input type="email" placeholder="owner@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Mobile Number</label>
                    <input type="text" placeholder="+91 00000 00000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Password</label>
                    <input type="password" placeholder="Create a strong password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setIsRegistered(true)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-indigo-600/20 transition-all">
                    Register & Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'taxi' && isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Fleet Dashboard</h1>
                <p className="text-slate-400">Manage your cars, verify documents, and set pricing.</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20">
                + Add New Car
              </button>
            </div>

            <div className="space-y-8">
              {/* Document Upload & Verification Section for a New/Existing Car */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Add / Update Car Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Car Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Car Model & Type</label>
                      <input type="text" placeholder="e.g. Innova Crysta (7 Seater)" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Total Quantity</label>
                      <input type="number" placeholder="How many similar cars?" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  {/* Documents Upload */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">📸</span>
                      <p className="text-sm text-white font-medium">Car Photos</p>
                      <p className="text-xs text-slate-500 mt-1">Upload Exterior/Interior</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">📘</span>
                      <p className="text-sm text-white font-medium">RC Book</p>
                      <p className="text-xs text-slate-500 mt-1">Registration Certificate</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">🛡️</span>
                      <p className="text-sm text-white font-medium">Insurance Policy</p>
                      <p className="text-xs text-slate-500 mt-1">Valid Insurance Document</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">✅</span>
                      <p className="text-sm text-white font-medium">Passing & Fitness</p>
                      <p className="text-xs text-slate-500 mt-1">RTO Fitness Certificate</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg transition-all">
                    Submit Documents for Verification
                  </button>
                </div>
              </div>

              {/* Pricing & Terms Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Pricing & Allowances</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Per KM Rate (₹)</label>
                      <input type="number" placeholder="e.g. 14" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Toll Tax & State Tax Details</label>
                      <input type="text" placeholder="e.g. Extra as per actuals" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Driver Allowance (Per Day)</label>
                      <input type="number" placeholder="e.g. 300" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Terms & Conditions</h3>
                  <p className="text-xs text-slate-400 mb-3">Add your own rules (e.g. minimum kms per day, night driving charges, AC policy).</p>
                  <textarea rows={6} placeholder="- Minimum 250 KM billing per day&#10;- Night halt charge ₹200 extra after 11 PM&#10;- AC will be turned off in hilly areas" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"></textarea>
                </div>
              </div>

              {/* Active Fleet Listing */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">My Listed Cars</h3>
                <div className="flex flex-col gap-4">
                  {/* Car Item */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-slate-800 rounded bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=150&q=80')" }}></div>
                      <div>
                        <h4 className="text-white font-bold text-base flex items-center gap-2">
                          Innova Crysta
                          <span className="bg-green-500/20 text-green-500 text-[10px] px-2 py-0.5 rounded border border-green-500/30 uppercase">Verified</span>
                        </h4>
                        <p className="text-slate-400 text-sm">7 Seater • ₹ 14/km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-500">Driver Allowance</p>
                        <p className="text-white font-medium text-sm">₹ 300/day</p>
                      </div>
                      <button className="text-indigo-400 hover:text-indigo-300 font-medium text-sm border border-indigo-500/30 px-3 py-1.5 rounded bg-indigo-500/10 transition-colors">Edit</button>
                    </div>
                  </div>
                  
                  {/* Car Item Pending */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center justify-between opacity-70">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-slate-800 rounded flex items-center justify-center text-xl">🚗</div>
                      <div>
                        <h4 className="text-white font-bold text-base flex items-center gap-2">
                          Maruti Swift Dzire
                          <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded border border-yellow-500/30 uppercase">Pending Verification</span>
                        </h4>
                        <p className="text-slate-400 text-sm">4 Seater • ₹ 11/km</p>
                      </div>
                    </div>
                    <button className="text-yellow-500 hover:text-yellow-400 font-medium text-sm underline">Upload Missing Docs</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurant' && !isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Partner Registration</h1>
                <p className="text-slate-400">First-time login. Please provide basic details to create your account.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Create Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Owner Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Business Name (Optional)</label>
                    <input type="text" placeholder="e.g. Gordhan Thal" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Email Address</label>
                    <input type="email" placeholder="owner@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Mobile Number</label>
                    <input type="text" placeholder="+91 00000 00000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Password</label>
                    <input type="password" placeholder="Create a strong password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setIsRegistered(true)} className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold shadow-lg shadow-orange-600/20 transition-all">
                    Register & Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'restaurant' && isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Restaurant Dashboard</h1>
                <p className="text-slate-400">Manage your dining details, verify documents, and update menu.</p>
              </div>
              <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-orange-600/20">
                + Add Menu Item
              </button>
            </div>

            <div className="space-y-8">
              {/* Document Upload & Verification Section */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Restaurant Details & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Restaurant Name</label>
                      <input type="text" placeholder="e.g. Gordhan Thal" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Cuisine Type</label>
                      <input type="text" placeholder="Gujarati, Punjabi, etc." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  {/* Documents Upload */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">📸</span>
                      <p className="text-sm text-white font-medium">Restaurant Photos</p>
                      <p className="text-xs text-slate-500 mt-1">Upload Ambiance</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">🍽️</span>
                      <p className="text-sm text-white font-medium">FSSAI License</p>
                      <p className="text-xs text-slate-500 mt-1">Food Safety Certificate</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">📜</span>
                      <p className="text-sm text-white font-medium">Trade License</p>
                      <p className="text-xs text-slate-500 mt-1">Municipal License</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">🧾</span>
                      <p className="text-sm text-white font-medium">Menu Photos</p>
                      <p className="text-xs text-slate-500 mt-1">Physical Menu Copy</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                  <button className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium shadow-lg transition-all">
                    Submit Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'local-ride' && !isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Partner Registration</h1>
                <p className="text-slate-400">First-time login. Please provide basic details to create your account.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Create Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Rider Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Email Address</label>
                    <input type="email" placeholder="rider@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Mobile Number</label>
                    <input type="text" placeholder="+91 00000 00000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Password</label>
                    <input type="password" placeholder="Create a strong password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setIsRegistered(true)} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg font-bold shadow-lg shadow-yellow-500/20 transition-all">
                    Register & Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'local-ride' && isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Rides Dashboard</h1>
                <p className="text-slate-400">Manage your local rides, verify documents, and set pricing.</p>
              </div>
              <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-yellow-600/20">
                + Add New Ride
              </button>
            </div>

            <div className="space-y-8">
              {/* Document Upload & Verification Section */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Vehicle Details & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Vehicle Type</label>
                      <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                        <option>Auto Rickshaw</option>
                        <option>Bike / Scooter</option>
                        <option>Mini Cab</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Vehicle Number</label>
                      <input type="text" placeholder="GJ-01-XX-0000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  {/* Documents Upload */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">🪪</span>
                      <p className="text-sm text-white font-medium">Driving License</p>
                      <p className="text-xs text-slate-500 mt-1">Valid RTO License</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">📘</span>
                      <p className="text-sm text-white font-medium">RC Book</p>
                      <p className="text-xs text-slate-500 mt-1">Registration Certificate</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">🛡️</span>
                      <p className="text-sm text-white font-medium">Insurance Policy</p>
                      <p className="text-xs text-slate-500 mt-1">Valid Insurance Document</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">✅</span>
                      <p className="text-sm text-white font-medium">Passing & Fitness</p>
                      <p className="text-xs text-slate-500 mt-1">RTO Fitness Certificate</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                  <button className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg font-medium shadow-lg transition-all">
                    Submit Documents
                  </button>
                </div>
              </div>

              {/* Real-time Ride Requests */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Live Ride Requests
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">Searching...</span>
                </div>
                
                {incomingRides.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <div className="text-4xl mb-2">📡</div>
                    <p>No new ride requests right now.</p>
                    <p className="text-xs mt-1">Keep this page open to receive live bookings.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {incomingRides.map(ride => (
                      <div key={ride.id} className="bg-slate-950 border border-yellow-500/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex-1 w-full">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded uppercase">New Request</span>
                            <span className="text-xs text-slate-400">Just now</span>
                          </div>
                          <p className="text-white font-medium mb-1 flex items-center gap-2"><span className="text-green-500">🟢</span> {ride.pickup}</p>
                          <p className="text-white font-medium flex items-center gap-2"><span className="text-red-500">📍</span> {ride.drop}</p>
                        </div>
                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                          <button onClick={() => acceptRide(ride.id)} className="flex-1 sm:flex-none px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg font-bold shadow-lg shadow-yellow-500/20 transition-all text-sm">
                            Accept Ride
                          </button>
                          <button onClick={() => setIncomingRides(prev => prev.filter(r => r.id !== ride.id))} className="flex-1 sm:flex-none px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-all text-sm">
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tour-package' && !isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Partner Registration</h1>
                <p className="text-slate-400">First-time login. Please provide basic details to create your account.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Create Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Owner Name</label>
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Agency Name</label>
                    <input type="text" placeholder="e.g. Dream Tours" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Email Address</label>
                    <input type="email" placeholder="owner@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Mobile Number</label>
                    <input type="text" placeholder="+91 00000 00000" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Password</label>
                    <input type="password" placeholder="Create a strong password" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setIsRegistered(true)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg shadow-emerald-600/20 transition-all">
                    Register & Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tour-package' && isRegistered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Packages Dashboard</h1>
                <p className="text-slate-400">Manage your holiday packages, itineraries, and pricing.</p>
              </div>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-600/20">
                + Add New Package
              </button>
            </div>

            <div className="space-y-8">
              {/* Document Upload & Verification Section */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-2">Agency Details & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Agency Name</label>
                      <input type="text" placeholder="e.g. Dream Tours" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Govt Registration Number</label>
                      <input type="text" placeholder="Registration number" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>

                  {/* Documents Upload */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">📜</span>
                      <p className="text-sm text-white font-medium">Company Registration</p>
                      <p className="text-xs text-slate-500 mt-1">Govt Approved Docs</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors">
                      <span className="text-2xl mb-2">🆔</span>
                      <p className="text-sm text-white font-medium">Owner PAN Card</p>
                      <p className="text-xs text-slate-500 mt-1">Identity Proof</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
                  <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-lg transition-all">
                    Submit Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
