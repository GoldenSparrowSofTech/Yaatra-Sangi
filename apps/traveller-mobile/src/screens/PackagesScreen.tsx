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

  const handleCallAgent = (pkg: any) => {
    Linking.openURL('tel:+919876543210');
  };

  const handleWhatsAppAgent = (pkg: any) => {
    const message = encodeURIComponent(`Hello, I want to inquire about the ${pkg.title} tour package.`);
    Linking.openURL(`whatsapp://send?phone=+919876543210&text=${message}`);
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
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity
                    onPress={() => handleCallAgent(pkg)}
                    style={{ backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11 }}>📞 Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleWhatsAppAgent(pkg)}
                    style={{ backgroundColor: '#25D366', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11 }}>💬 WhatsApp</Text>
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

