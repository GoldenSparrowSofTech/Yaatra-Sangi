"use client";

import React, { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const mockHotels = [
  { id: '1', slug: 'the-leela-palace', name: 'The Leela Palace', location: 'Udaipur, Rajasthan', rating: 4.9, reviews: 1240, price: 18500, image: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?auto=format&fit=crop&w=800&q=80', amenities: ['Pool', 'Spa', 'Lake View', 'Free WiFi'], featured: true },
  { id: '2', slug: 'taj-mahal-tower', name: 'Taj Mahal Tower', location: 'Mumbai, Maharashtra', rating: 4.8, reviews: 3200, price: 15200, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', amenities: ['Sea View', 'Gym', 'Restaurant', 'Bar'], featured: false },
  { id: '3', slug: 'rambagh-palace', name: 'Rambagh Palace', location: 'Jaipur, Rajasthan', rating: 4.9, reviews: 890, price: 22000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', amenities: ['Heritage Property', 'Pool', 'Spa', 'Fine Dining'], featured: true },
];

const mockTaxis = [
  { id: '1', slug: 'royal-cabs', name: 'Royal Cabs', type: 'SUV (Innova)', location: 'Delhi NCR', rating: 4.8, price: 15, perKm: true, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80' },
  { id: '2', slug: 'shiv-taxi', name: 'Shiv Taxi Service', type: 'Sedan (Dzire)', location: 'Mumbai', rating: 4.6, price: 12, perKm: true, image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80' },
];

const mockRestaurants = [
  { id: '1', slug: 'gordhan-thal', name: 'Gordhan Thal', type: 'Gujarati Thali', location: 'Ahmedabad, Gujarat', rating: 4.8, priceRange: '₹₹', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80', specialities: ['Unlimited Thali', 'Farsan'] },
];

const mockPackages = [
  { id: '1', slug: 'goa-4-days', title: 'Goa Beach Holiday', duration: '3N/4D', location: 'Goa, India', rating: 4.7, price: 15999, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
];

const mockRides = [
  { id: '1', slug: 'ramesh-bhai', name: 'Ramesh Bhai', type: 'Auto Rickshaw', location: 'Ahmedabad', rating: 4.9, price: 10, perKm: true, image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=800&q=80' },
];

export default function SeedDatabasePage() {
  const [status, setStatus] = useState("Ready to seed");
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    setStatus("Disabled: Browser-based database mutation is restricted. Use server-side migrations/seed scripts.");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Database Admin</h1>
      <p className="text-amber-400 mb-8 max-w-md text-center font-medium">
        Browser-based database seeding is disabled for security (SEC-01). Database initialization must be executed through controlled backend server CLI commands only.
      </p>

      <button
        disabled={true}
        className="px-8 py-4 bg-slate-800 text-slate-500 font-bold rounded-xl shadow-lg cursor-not-allowed opacity-50"
      >
        Database Seeding Disabled in Browser
      </button>

      <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-slate-800 w-full max-w-md">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Status Log</h3>
        <p className="text-emerald-400 font-mono text-sm">{status}</p>
      </div>
    </div>
  );
}
