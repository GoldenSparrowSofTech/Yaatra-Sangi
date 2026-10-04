'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

export default function LocalRidesPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [step, setStep] = useState<'location' | 'select_vehicle' | 'searching' | 'accepted'>('location');
  const [selectedVehicle, setSelectedVehicle] = useState<'bike' | 'auto' | 'cab' | 'ambulance'>('bike');
  
  const [acceptedDriver, setAcceptedDriver] = useState<any | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    // Connect to NestJS WebSocket Gateway
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    newSocket.on('ride_requested', (data) => {
      console.log('Ride requested successfully', data);
      setBookingId(data.id);
      
      // FOR DEMO PURPOSES: We simulate a driver accepting it from another client app
      // In a real app, a SEPARATE driver app would receive this broadcast and emit 'accept_ride'
      setTimeout(() => {
         newSocket.emit('accept_ride', { bookingId: data.id, driverId: "partner@yatrasangi.com" });
      }, 4000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Update listener when bookingId changes
  useEffect(() => {
    if (socket && bookingId) {
      const handleStatusUpdate = (data: any) => {
         if (data.status === 'ACCEPTED') {
           setAcceptedDriver({
             driverName: data.driverId || 'Live Captain',
             vehicleType: data.vehicleType || 'Bike',
             vehicleModel: 'Honda Activa',
             vehicleNumber: 'GJ01-XX-9999',
             rating: 4.9,
             otp: data.otpPin || '1234',
             contactPhone: '+919876543210',
             image: 'https://images.unsplash.com/photo-1593081045266-9a5c898b671a?auto=format&fit=crop&q=80',
           });
           setStep('accepted');
         }
      };

      socket.on(`ride_status_updated_${bookingId}`, handleStatusUpdate);

      return () => {
        socket.off(`ride_status_updated_${bookingId}`, handleStatusUpdate);
      };
    }
  }, [socket, bookingId]);

  const handleSearchClick = () => {
    if (pickup && drop) {
      setStep('select_vehicle');
    } else {
      alert("Please enter both pickup and drop locations");
    }
  };

  const handleBookRide = () => {
    setStep('searching');
    if (socket) {
       let email = "guest-user-id";
       if (typeof window !== 'undefined') {
         const userDataString = localStorage.getItem('userData');
         if (userDataString) {
           try {
             const userData = JSON.parse(userDataString);
             email = userData.email || email;
           } catch(e) {}
         }
       }
       // Emit real-time request to the NestJS backend
       socket.emit('request_ride', {
         userId: email,
         pickup,
         drop,
         vehicleType: selectedVehicle
       });
    }
  };

  return (
    <main className="h-screen w-full relative overflow-hidden bg-slate-900 font-sans">
      {/* Background Map Simulation */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')",
          filter: step === 'searching' ? 'brightness(0.5)' : 'brightness(0.8)',
          transform: step === 'searching' ? 'scale(1.1)' : 'scale(1)',
        }}
      ></div>

      {/* Map Overlay Grid */}
      <div className="absolute inset-0 z-0 bg-slate-900/20 pointer-events-none"></div>

      {/* Top Navigation / App Bar */}
      <div className="absolute top-0 w-full z-20 p-4 md:p-6 bg-gradient-to-b from-slate-950/80 to-transparent">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
            ←
          </button>
          <h1 className="text-xl font-bold text-white tracking-wide">Local Rides</h1>
        </div>
      </div>

      {/* Central Content Area (Mobile App Layout) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between pt-20 pb-4 px-4 pointer-events-none">
        
        <div className="max-w-md w-full mx-auto pointer-events-auto">
          {/* Step 1: Location Input Cards */}
          {(step === 'location' || step === 'select_vehicle') && (
            <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-2xl mt-2 transform transition-all duration-300">
              <div className="relative flex flex-col gap-4">
                {/* Timeline dotted line */}
                <div className="absolute left-3.5 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-700"></div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-500/20"></div>
                  <input 
                    type="text" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Pickup location" 
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-3 h-3 bg-red-500 rounded-sm ring-4 ring-red-500/20"></div>
                  <input 
                    type="text" 
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="Drop destination" 
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
              </div>

              {step === 'location' && (
                <button 
                  onClick={handleSearchClick}
                  className="w-full mt-6 bg-yellow-400 text-black font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:bg-yellow-500 transition-all active:scale-95"
                >
                  Find Rides
                </button>
              )}
            </div>
          )}

          {/* Searching Animation on Map */}
          {step === 'searching' && (
            <div className="flex flex-col items-center justify-center h-[50vh] mt-10">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-32 h-32 bg-yellow-400/20 rounded-full animate-ping"></div>
                <div className="absolute w-64 h-64 border border-yellow-400/30 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute w-96 h-96 border border-yellow-400/10 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.5)] z-10 text-2xl">
                  📍
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sheets Area */}
        <div className="max-w-md w-full mx-auto pointer-events-auto mt-auto">
          
          {/* Step 2: Vehicle Selection Bottom Sheet */}
          {step === 'select_vehicle' && (
            <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300">
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6"></div>
              <h3 className="text-white font-bold text-lg mb-4">Available Rides</h3>
              
              <div className="space-y-3 mb-6">
                {/* Bike Option */}
                <div 
                  onClick={() => setSelectedVehicle('bike')}
                  className={`flex items-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${selectedVehicle === 'bike' ? 'bg-yellow-400/10 border-yellow-400' : 'bg-slate-900 border-transparent'}`}
                >
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-3xl">🏍️</div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-white font-bold flex items-center gap-2">Bike <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">1 min away</span></h4>
                    <p className="text-slate-400 text-xs">Beat the traffic</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">₹ 45</p>
                  </div>
                </div>

                {/* Auto Option */}
                <div 
                  onClick={() => setSelectedVehicle('auto')}
                  className={`flex items-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${selectedVehicle === 'auto' ? 'bg-yellow-400/10 border-yellow-400' : 'bg-slate-900 border-transparent'}`}
                >
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-3xl">🛺</div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-white font-bold flex items-center gap-2">Auto <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">3 mins away</span></h4>
                    <p className="text-slate-400 text-xs">Affordable & comfy</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">₹ 80</p>
                  </div>
                </div>

                {/* Cab Option */}
                <div 
                  onClick={() => setSelectedVehicle('cab')}
                  className={`flex items-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${selectedVehicle === 'cab' ? 'bg-yellow-400/10 border-yellow-400' : 'bg-slate-900 border-transparent'}`}
                >
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-3xl">🚕</div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-white font-bold flex items-center gap-2">Mini Cab <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">5 mins away</span></h4>
                    <p className="text-slate-400 text-xs">AC & spacious</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">₹ 140</p>
                  </div>
                </div>

                {/* Ambulance Option */}
                <div 
                  onClick={() => setSelectedVehicle('ambulance')}
                  className={`flex items-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${selectedVehicle === 'ambulance' ? 'bg-red-500/10 border-red-500' : 'bg-slate-900 border-transparent'}`}
                >
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-3xl">🚑</div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-white font-bold flex items-center gap-2">Ambulance <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-0.5 rounded border border-red-900">Emergency</span></h4>
                    <p className="text-slate-400 text-xs">Medical transport</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">₹ 500</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBookRide}
                className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl text-lg shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:bg-yellow-500 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Book {selectedVehicle.charAt(0).toUpperCase() + selectedVehicle.slice(1)}
              </button>
            </div>
          )}

          {/* Step 3: Searching Bottom Sheet */}
          {step === 'searching' && (
            <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300 text-center">
              <h3 className="text-white font-bold text-xl mb-2">Contacting Captains</h3>
              <p className="text-slate-400 text-sm mb-6">Sending your request to nearby captains...</p>
              
              <div className="w-full bg-slate-900 rounded-full h-2 mb-6 overflow-hidden">
                <div className="bg-yellow-400 h-full w-1/2 rounded-full animate-[ping_2s_infinite]"></div>
              </div>

              <button 
                onClick={() => setStep('select_vehicle')}
                className="text-red-400 font-bold py-3 w-full hover:bg-red-500/10 rounded-xl transition"
              >
                Cancel Request
              </button>
            </div>
          )}

          {/* Step 4: Accepted Driver Bottom Sheet */}
          {step === 'accepted' && acceptedDriver && (
            <div className="bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-full duration-300">
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-4"></div>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-white font-bold text-xl">Arriving in 4 min</h3>
                  <p className="text-slate-400 text-sm">Your captain is on the way</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">PIN</p>
                  <p className="text-white font-mono font-bold text-xl tracking-widest">{acceptedDriver.otp}</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-800 rounded-full border-2 border-slate-700 bg-cover bg-center" style={{ backgroundImage: `url(${acceptedDriver.image})` }}></div>
                  <div>
                    <h4 className="text-white font-bold flex items-center gap-1">
                      {acceptedDriver.driverName}
                      <span className="text-xs bg-slate-800 text-yellow-400 px-1.5 py-0.5 rounded ml-2">⭐ {acceptedDriver.rating}</span>
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">{acceptedDriver.vehicleModel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-400 text-black font-mono font-bold px-2 py-1 rounded text-sm mb-1">
                    {acceptedDriver.vehicleNumber}
                  </div>
                  <p className="text-white font-bold">₹ {selectedVehicle === 'bike' ? 45 : selectedVehicle === 'auto' ? 80 : 140}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <a href={`tel:${acceptedDriver.contactPhone}`} className="flex-1 bg-slate-900 border border-slate-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition">
                  📞 Call
                </a>
                <a href={`https://wa.me/${acceptedDriver.contactPhone}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#25D366]/20">
                  💬 Message
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
