import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';

interface LocalDriver {
  id: string;
  driverName: string;
  vehicleType: 'Auto' | 'Bike' | 'Cab';
  vehicleModel: string;
  vehicleNumber: string;
  rating: number;
  reviews: number;
  baseFare: number;
  perKmRate: number;
  city: string;
  contactPhone: string;
  available: boolean;
}

const LOCAL_DRIVERS: LocalDriver[] = [
  {
    id: '1',
    driverName: 'Ramesh Bhai Patel',
    vehicleType: 'Auto',
    vehicleModel: 'Bajaj RE Compact',
    vehicleNumber: 'GJ-03-AX-1234',
    rating: 4.9,
    reviews: 128,
    baseFare: 30,
    perKmRate: 12,
    city: 'Rajkot, Gujarat',
    contactPhone: '+919876543210',
    available: true,
  },
  {
    id: '2',
    driverName: 'Suresh Kumar',
    vehicleType: 'Bike',
    vehicleModel: 'Hero Splendor Plus',
    vehicleNumber: 'GJ-03-BK-5678',
    rating: 4.8,
    reviews: 94,
    baseFare: 20,
    perKmRate: 8,
    city: 'Rajkot, Gujarat',
    contactPhone: '+919876543211',
    available: true,
  },
  {
    id: '3',
    driverName: 'Vikram Singh',
    vehicleType: 'Cab',
    vehicleModel: 'Maruti WagonR (AC)',
    vehicleNumber: 'GJ-03-TC-9012',
    rating: 4.9,
    reviews: 215,
    baseFare: 100,
    perKmRate: 15,
    city: 'Rajkot, Gujarat',
    contactPhone: '+919876543212',
    available: true,
  },
];

/**
 * ADR-001: Local Ride Providers as a Free Direct-Contact Directory
 * Replaces live ride dispatch with direct call/WhatsApp mediator directory.
 */
export const LocalRidesScreen = ({ user }: { user?: any }) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'Auto' | 'Bike' | 'Cab'>('ALL');
  const [searchCity, setSearchCity] = useState('');

  const filteredDrivers = LOCAL_DRIVERS.filter((driver) => {
    const matchesCategory = selectedFilter === 'ALL' || driver.vehicleType === selectedFilter;
    const matchesCity = !searchCity || driver.city.toLowerCase().includes(searchCity.toLowerCase()) || driver.driverName.toLowerCase().includes(searchCity.toLowerCase());
    return matchesCategory && matchesCity;
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleWhatsApp = (phone: string, driverName: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${driverName}, I found your contact on YaatraSangi and would like to hire your ride.`);
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${text}`).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      {/* Header Banner */}
      <View style={{ backgroundColor: '#0f172a', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginBottom: 4 }}>
          🛺 Local Rides Directory
        </Text>
        <Text style={{ color: '#34d399', fontSize: 13, fontWeight: '600' }}>
          100% Free for Drivers & Passengers • 0% Commission
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
          Contact verified local auto, bike, and cab captains directly. No surge pricing, no middlemen.
        </Text>
      </View>

      {/* Search Input */}
      <View style={{ marginBottom: 12 }}>
        <TextInput
          value={searchCity}
          onChangeText={setSearchCity}
          placeholder="Search by city or driver name..."
          placeholderTextColor="#64748b"
          style={{ backgroundColor: '#1e293b', color: 'white', padding: 12, borderRadius: 10, fontSize: 14 }}
        />
      </View>

      {/* Category Filter Tabs */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        {(['ALL', 'Auto', 'Bike', 'Cab'] as const).map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedFilter(cat)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 20,
              backgroundColor: selectedFilter === cat ? '#f59e0b' : '#1e293b',
            }}
          >
            <Text style={{ color: selectedFilter === cat ? '#000' : '#cbd5e1', fontWeight: 'bold', fontSize: 13 }}>
              {cat === 'ALL' ? 'All Rides' : cat === 'Auto' ? '🛺 Auto' : cat === 'Bike' ? '🏍️ Bike' : '🚕 City Cab'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Drivers List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredDrivers.map((driver) => (
          <View
            key={driver.id}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#1e293b',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <View>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{driver.driverName}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>
                  {driver.vehicleModel} • {driver.vehicleNumber}
                </Text>
                <Text style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>📍 {driver.city}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: 14 }}>
                  ★ {driver.rating} ({driver.reviews})
                </Text>
                <Text style={{ color: '#10b981', fontSize: 11, fontWeight: 'bold', marginTop: 2 }}>
                  ● Available
                </Text>
              </View>
            </View>

            {/* Estimated Pricing Info */}
            <View style={{ flexDirection: 'row', backgroundColor: '#1e293b', padding: 8, borderRadius: 8, marginBottom: 12, justifyContent: 'space-around' }}>
              <Text style={{ color: '#cbd5e1', fontSize: 12 }}>
                Base Fare: <Text style={{ color: 'white', fontWeight: 'bold' }}>₹{driver.baseFare}</Text>
              </Text>
              <Text style={{ color: '#cbd5e1', fontSize: 12 }}>
                Per Km: <Text style={{ color: 'white', fontWeight: 'bold' }}>₹{driver.perKmRate}/km</Text>
              </Text>
            </View>

            {/* Direct Contact Actions */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => handleCall(driver.contactPhone)}
                style={{
                  flex: 1,
                  backgroundColor: '#2563eb',
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>📞 Call Driver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleWhatsApp(driver.contactPhone, driver.driverName)}
                style={{
                  flex: 1,
                  backgroundColor: '#16a34a',
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>💬 WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
