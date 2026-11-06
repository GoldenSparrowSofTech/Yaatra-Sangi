import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { apiFetch } from '../config/api.js';
import { ApiService } from '../services/api.service.js';

export const CabsScreen = ({ initialSearch = '' }: { initialSearch?: string }) => {
  const searchCities = initialSearch ? initialSearch.split(',') : [];
  const [pickup, setPickup] = useState(searchCities.length > 0 ? searchCities[0] : '');
  const [dropoff, setDropoff] = useState(searchCities.length > 1 ? searchCities[searchCities.length - 1] : '');
  const [cabs, setCabs] = useState<any[]>([]);
  const [allCabs, setAllCabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCabs = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/taxis');
      if (res.ok) {
        const data = await res.json();
        setAllCabs(data);
        setCabs(data);
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabs();
  }, []);

  const handleSearch = () => {
    if (pickup || dropoff) {
      const filtered = allCabs.filter(
        (t) =>
          (t.location && t.location.toLowerCase().includes(pickup.toLowerCase())) ||
          (t.location && t.location.toLowerCase().includes(dropoff.toLowerCase())),
      );
      setCabs(filtered);
    } else {
      setCabs(allCabs);
    }
  };

  const handleBookCab = async (cab: any) => {
    Alert.alert(
      'Reserve Cab',
      `Hold ${cab.name} (${cab.type}) for your journey?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Hold & Pay',
          onPress: async () => {
            const today = new Date().toISOString().split('T')[0];
            const result = await ApiService.createBookingHold('CAB', cab.slug || cab.id.toString(), today);
            if (result.bookingId) {
              Alert.alert('Cab Reserved! 🚕', `15-minute hold created.\nBooking ID: ${result.bookingId.slice(0, 8)}...`);
            } else {
              Alert.alert('Notice', result.error || 'Failed to hold cab');
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#020617' }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80' }}
        style={{ width: '100%', padding: 25, paddingVertical: 40 }}
        imageStyle={{ opacity: 0.3 }}
      >
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 15 }}>
          Book Your <Text style={{ color: '#6366f1' }}>Ride</Text>
        </Text>

        <View
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#334155',
          }}
        >
          <TextInput
            value={pickup}
            onChangeText={setPickup}
            placeholder="Pickup City"
            placeholderTextColor="#64748b"
            style={{
              backgroundColor: '#020617',
              color: 'white',
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: '#334155',
            }}
          />
          <TextInput
            value={dropoff}
            onChangeText={setDropoff}
            placeholder="Drop-off Destination"
            placeholderTextColor="#64748b"
            style={{
              backgroundColor: '#020617',
              color: 'white',
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#334155',
            }}
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={{ backgroundColor: '#4f46e5', padding: 14, borderRadius: 8, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Find Outstation Cabs</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={{ padding: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#4f46e5" />
        ) : (
          cabs.map((cab) => (
            <View
              key={cab.id}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 16,
                flexDirection: 'row',
              }}
            >
              <Image source={{ uri: cab.image }} style={{ width: 120, height: 120 }} />
              <View style={{ padding: 12, flex: 1, justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{cab.name}</Text>
                  <Text style={{ color: '#c084fc', fontSize: 12, fontWeight: 'bold' }}>{cab.type}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>📍 {cab.location}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    ₹{cab.price}
                    <Text style={{ fontSize: 10, color: '#94a3b8' }}>{cab.perKm ? '/km' : '/trip'}</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleBookCab(cab)}
                    style={{ backgroundColor: '#4f46e5', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Reserve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

