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
    setLoading(true);
    setStatus("Seeding hotels...");
    try {
      for (const item of mockHotels) await setDoc(doc(db, "hotels", item.id), item);
      
      setStatus("Seeding taxis...");
      for (const item of mockTaxis) await setDoc(doc(db, "taxis", item.id), item);
      
      setStatus("Seeding restaurants...");
      for (const item of mockRestaurants) await setDoc(doc(db, "restaurants", item.id), item);
      
      setStatus("Seeding packages...");
      for (const item of mockPackages) await setDoc(doc(db, "packages", item.id), item);
      
      setStatus("Seeding rides...");
      for (const item of mockRides) await setDoc(doc(db, "rides", item.id), item);

      setStatus("Database seeding complete! All initial data uploaded to Firebase.");
    } catch (err: any) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Database Admin</h1>
      <p className="text-slate-400 mb-8 max-w-md text-center">
        This tool will upload the default demo data (Hotels, Taxis, Restaurants, etc.) to your connected Firebase Firestore database.
      </p>

      <button
        onClick={seedData}
        disabled={loading}
        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg disabled:opacity-50"
      >
        {loading ? "Uploading Data..." : "Initialize Database"}
      </button>

      <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-slate-800 w-full max-w-md">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Status Log</h3>
        <p className="text-emerald-400 font-mono text-sm">{status}</p>
      </div>
    </div>
  );
}
