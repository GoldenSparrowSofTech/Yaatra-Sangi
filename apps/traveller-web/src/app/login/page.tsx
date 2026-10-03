"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile === "admin") {
      window.location.href = "/admin";
      return;
    }
    if (mobile.length >= 10 && name.trim() !== "" && city.trim() !== "" && stateName.trim() !== "") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        window.alert(`Mock SMS: Your YatraSangi OTP is 123456`);
        setStep(2);
      }, 1000);
    } else {
      window.alert("Please fill all details and enter a valid 10-digit mobile number");
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length >= 4) {
      setLoading(true);
      setTimeout(() => {
        localStorage.setItem('userAuth', 'true');
        localStorage.setItem('userData', JSON.stringify({ name, city, state: stateName, mobile }));
        window.location.href = "/dashboard";
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden z-10">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="text-4xl">📱</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome</h1>
          <p className="text-slate-400">Login securely with your mobile</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-1/2 bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="City"
                required
              />
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-1/2 bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="State"
                required
              />
            </div>
            <div>
              <div className="flex bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden focus-within:border-emerald-500 transition-colors">
                <div className="bg-slate-900 px-4 flex items-center justify-center border-r border-slate-800">
                  <span className="text-slate-400 font-bold">+91</span>
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-transparent text-white px-4 py-3 focus:outline-none text-lg font-bold tracking-wider"
                  placeholder="Mobile Number"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || mobile.length < 10}
              className="w-full bg-emerald-500 text-white font-bold rounded-2xl px-4 py-4 hover:bg-emerald-400 transition-colors disabled:opacity-50 text-lg shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <p className="text-center text-slate-400 mb-4 text-sm">OTP sent to +91 {mobile}</p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-4 focus:outline-none focus:border-emerald-500 transition-colors text-center text-3xl font-bold tracking-[1em]"
                placeholder="••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full bg-emerald-500 text-white font-bold rounded-2xl px-4 py-4 hover:bg-emerald-400 transition-colors disabled:opacity-50 text-lg shadow-lg shadow-emerald-500/20"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-slate-400 font-medium py-2 hover:text-white transition-colors"
            >
              Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
