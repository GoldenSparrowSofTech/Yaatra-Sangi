"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin") {
      window.location.href = "/admin";
      return;
    }
    
    if (email.trim() && password.trim()) {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('userAuth', 'true');
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('userData', JSON.stringify({ email }));
          window.location.href = "/dashboard";
        } else {
          setError("Invalid email or password");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in both email and password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden z-10">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login securely with your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Email Address"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white font-bold rounded-2xl px-4 py-4 hover:bg-emerald-400 transition-colors disabled:opacity-50 text-lg shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-slate-400 text-sm">
          Use <span className="text-emerald-400">traveler@yatrasangi.com</span> and <span className="text-emerald-400">password123</span> for testing
        </div>
      </div>
    </div>
  );
}
