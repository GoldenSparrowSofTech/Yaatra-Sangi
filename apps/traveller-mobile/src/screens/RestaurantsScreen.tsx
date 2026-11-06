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

export const RestaurantsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/restaurants')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setAllRestaurants(list);
        setRestaurants(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = allRestaurants.filter(
        (r) =>
          (r.name && r.name.toLowerCase().includes(text.toLowerCase())) ||
          (r.location && r.location.toLowerCase().includes(text.toLowerCase())),
      );
      setRestaurants(filtered);
    } else {
      setRestaurants(allRestaurants);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#020617' }}
      contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>
        Local <Text style={{ color: '#f43f5e' }}>Restaurants</Text>
      </Text>
      <Text style={{ color: '#94a3b8', marginBottom: 15 }}>
        Discover top authentic dining near your destinations.
      </Text>

      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search by restaurant or city..."
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
        <ActivityIndicator size="large" color="#f43f5e" style={{ marginTop: 40 }} />
      ) : (
        restaurants.map((rest) => (
          <View
            key={rest.id}
            style={{
              backgroundColor: '#1e293b',
              borderRadius: 16,
              overflow: 'hidden',
              marginBottom: 16,
            }}
          >
            <ImageBackground source={{ uri: rest.image }} style={{ width: '100%', height: 160 }} />
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1 }}>{rest.name}</Text>
                <View style={{ backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11 }}>★ {rest.rating}</Text>
                </View>
              </View>
              <Text style={{ color: '#94a3b8', fontSize: 13, marginVertical: 4 }}>{rest.cuisine}</Text>
              <Text style={{ color: '#cbd5e1', fontSize: 12 }}>📍 {rest.location}</Text>

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
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                  ₹{rest.priceForTwo} <Text style={{ fontSize: 12, color: '#94a3b8' }}>for two</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => Alert.alert('Table Booking', `Reserve a table at ${rest.name}?`)}
                  style={{ backgroundColor: '#f43f5e', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Reserve Table</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

