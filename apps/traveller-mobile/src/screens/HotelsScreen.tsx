import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Linking,
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

  const handleCallHotel = (hotel: Hotel) => {
    Linking.openURL('tel:+919876543210');
  };

  const handleWhatsAppHotel = (hotel: Hotel) => {
    const message = encodeURIComponent(`Hello, I am interested in inquiring about room availability at ${hotel.name}.`);
    Linking.openURL(`whatsapp://send?phone=+919876543210&text=${message}`);
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
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleCallHotel(hotel)}
                    style={{ backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>📞 Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleWhatsAppHotel(hotel)}
                    style={{ backgroundColor: '#25D366', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>💬 WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

