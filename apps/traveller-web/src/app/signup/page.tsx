'use client';
import { useState } from 'react';
import Link from 'next/link';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [partnerType, setPartnerType] = useState('taxi'); // taxi, bike, hotel
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update display name
      await updateProfile(user, { displayName: name });

      // 3. Save partner role in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: partnerType, // 'taxi', 'bike', or 'hotel'
        status: 'pending_verification', // Requires document upload next
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      
      // Redirect to onboarding page after successful partner signup
      setTimeout(() => {
        window.location.href = '/partner-onboarding';
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">Account Created!</h2>
          <p className="text-slate-300">Redirecting to document verification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Partner Signup</h1>
          <p className="text-slate-400">Join <span className="font-bold"><span className="text-[#0d59a8]">Yaatra</span><span className="text-[#f97316]">Sangi</span></span> as a Business Partner</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-400 mb-2">What are you joining as?</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setPartnerType('driver')}
                className={`py-4 px-2 rounded-2xl border text-sm font-bold flex flex-col items-center gap-2 transition-all ${partnerType === 'driver' || partnerType === 'taxi' || partnerType === 'bike' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <div className="flex gap-2 text-2xl">🚕 🏍️</div>
                <span>Driver Partner</span>
                <span className="text-xs font-normal text-slate-400 text-center">Add multiple vehicles (Cab, Bike) for Local & Outstation rides.</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setPartnerType('hotel')}
                className={`py-4 px-2 rounded-2xl border text-sm font-bold flex flex-col items-center gap-2 transition-all ${partnerType === 'hotel' ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.2)]' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <div className="text-2xl">🏨</div>
                <span>Hotel Partner</span>
                <span className="text-xs font-normal text-slate-400 text-center">List your hotel rooms, resorts, or homestays.</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="partner@example.com"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="Create a strong password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up as Partner'}
          </button>
          
          <div className="mt-6 text-center text-slate-400 text-sm">
            Already a partner?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
