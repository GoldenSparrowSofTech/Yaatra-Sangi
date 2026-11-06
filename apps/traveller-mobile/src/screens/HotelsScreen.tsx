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
import { ApiService } from '../services/api.service.js';
import { Hotel } from '../types/index.js';

export const HotelsScreen = ({ initialSearch = '' }: { initialSearch?: string }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotels(initialSearch);
  }, [initialSearch]);

  const loadHotels = async (search?: string) => {
    setLoading(true);
    const data = await ApiService.fetchHotels(search);
    setAllHotels(data);
    setHotels(data);
    setLoading(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = allHotels.filter(
        (h) =>
          (h.name && h.name.toLowerCase().includes(text.toLowerCase())) ||
          (h.location && h.location.toLowerCase().includes(text.toLowerCase())),
      );
      setHotels(filtered);
    } else {
      setHotels(allHotels);
    }
  };

  const handleBook = async (hotel: Hotel) => {
    Alert.alert(
      'Hold Room Reservation',
      `Create a 15-minute temporary hold for ${hotel.name} at ₹${hotel.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Hold & Pay',
          onPress: async () => {
            const today = new Date().toISOString().split('T')[0];
            const result = await ApiService.createBookingHold('HOTEL', hotel.id, today);
            if (result.bookingId) {
              Alert.alert(
                'Reservation Held! 🔒',
                `Hold active for 15 minutes.\nBooking ID: ${result.bookingId.slice(0, 8)}...\nAmount: ₹${result.totalAmount}`,
              );
            } else {
              Alert.alert('Notice', result.error || 'Failed to hold room');
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
        Luxury <Text style={{ color: '#10b981' }}>Hotels</Text>
      </Text>
      <Text style={{ color: '#94a3b8', marginBottom: 15 }}>
        Verified stays curated with a 10 km destination proximity search.
      </Text>

      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search by hotel name or city..."
        placeholderTextColor="#64748b"
        style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: 15,
          borderRadius: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#334155',
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 50 }} />
      ) : (
        hotels.map((hotel) => (
          <View
            key={hotel.id}
            style={{
              backgroundColor: '#1e293b',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 20,
            }}
          >
            <ImageBackground
              source={{ uri: hotel.image || 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80' }}
              style={{ width: '100%', height: 200 }}
            />
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', flex: 1 }}>
                  {hotel.name}
                </Text>
                <View
                  style={{
                    backgroundColor: '#10b981',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                    ★ {hotel.rating || 4.5}
                  </Text>
                </View>
              </View>
              <Text style={{ color: '#94a3b8', fontSize: 14, marginVertical: 5 }}>
                📍 {hotel.location} {hotel.distanceKm ? `(${hotel.distanceKm} km away)` : ''}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                  ₹{hotel.price}
                  <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: 'normal' }}> / night</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => handleBook(hotel)}
                  style={{ backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
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

