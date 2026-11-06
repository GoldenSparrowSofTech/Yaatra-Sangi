import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { apiFetch } from '../config/api.js';
import { ApiService } from '../services/api.service.js';

export const PackagesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState<any[]>([]);
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/packages')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAllPackages(list);
        setPackages(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = allPackages.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(text.toLowerCase())) ||
          (p.destination && p.destination.toLowerCase().includes(text.toLowerCase())),
      );
      setPackages(filtered);
    } else {
      setPackages(allPackages);
    }
  };

  const handleBookPackage = (pkg: any) => {
    Alert.alert(
      'Hold Package Tour',
      `Hold ${pkg.title} (${pkg.duration}) for ₹${pkg.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Hold & Pay',
          onPress: async () => {
            const today = new Date().toISOString().split('T')[0];
            const result = await ApiService.createBookingHold('PACKAGE', pkg.slug || pkg.id.toString(), today);
            if (result.bookingId) {
              Alert.alert('Package Reserved! 🌴', `15-minute hold active.\nBooking ID: ${result.bookingId.slice(0, 8)}...`);
            } else {
              Alert.alert('Notice', result.error || 'Failed to hold package');
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#020617' }}
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>
        Tour <Text style={{ color: '#38bdf8' }}>Packages</Text>
      </Text>
      <Text style={{ color: '#94a3b8', marginBottom: 15 }}>
        Curated multi-day journeys with stays, cabs, and sightseeing.
      </Text>

      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search by destination or package..."
        placeholderTextColor="#64748b"
        style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: 14,
          borderRadius: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#334155',
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#38bdf8" style={{ marginTop: 40 }} />
      ) : (
        packages.map((pkg) => (
          <View
            key={pkg.id}
            style={{
              backgroundColor: '#1e293b',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 16,
            }}
          >
            <ImageBackground source={{ uri: pkg.image }} style={{ width: '100%', height: 160 }} />
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1 }}>{pkg.title}</Text>
                <View style={{ backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11 }}>★ {pkg.rating}</Text>
                </View>
              </View>
              <Text style={{ color: '#38bdf8', fontSize: 13, marginVertical: 4 }}>⏱️ {pkg.duration}</Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: '#334155',
                  paddingTop: 10,
                }}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>₹{pkg.price}</Text>
                <TouchableOpacity
                  onPress={() => handleBookPackage(pkg)}
                  style={{ backgroundColor: '#0284c7', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Reserve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

