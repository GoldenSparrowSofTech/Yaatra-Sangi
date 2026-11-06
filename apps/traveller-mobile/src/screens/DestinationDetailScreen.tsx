import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { apiFetch } from '../config/api.js';
import { Destination, DestinationDetailProps, Place, Hotel } from '../types/index.js';

export const DestinationDetailScreen: React.FC<DestinationDetailProps> = ({
  destinationId,
  onBack,
}) => {
  const [data, setData] = useState<Destination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiFetch(`/destinations/${destinationId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.statusCode >= 400 || !json.name) {
          setData(null);
        } else {
          setData(json);
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [destinationId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#34d399" />
        <Text style={{ color: '#34d399', fontSize: 18, marginTop: 15 }}>Fetching destination details...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>Destination details unavailable</Text>
        <TouchableOpacity onPress={onBack} style={{ backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{
          uri: data.image || data.placesToVisit?.[0]?.image || 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80',
        }}
        style={{ height: 350, justifyContent: 'flex-start', paddingTop: 40, paddingHorizontal: 20 }}
      >
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(2, 6, 23, 0.5)' }} />
        <TouchableOpacity onPress={onBack} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 20, alignSelf: 'flex-start' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>← Back</Text>
        </TouchableOpacity>
        <View style={{ marginTop: 'auto', paddingBottom: 30 }}>
          <Text style={{ color: 'white', fontSize: 40, fontWeight: 'bold' }}>{data.name}</Text>
          <Text style={{ color: '#cbd5e1', fontSize: 16, marginTop: 10 }}>{data.description}</Text>
        </View>
      </ImageBackground>

      <View style={{ padding: 20 }}>
        {data.placesToVisit && data.placesToVisit.length > 0 && (
          <>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>Top Places to Visit</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 30 }}>
              {data.placesToVisit.map((place: Place, i: number) => (
                <View key={i} style={{ width: 200, marginRight: 15, backgroundColor: '#0f172a', borderRadius: 16, overflow: 'hidden' }}>
                  <ImageBackground source={{ uri: place.image }} style={{ height: 120 }} />
                  <View style={{ padding: 15 }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>{place.name}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }} numberOfLines={2}>{place.description}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {data.hotels && data.hotels.length > 0 && (
          <>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>Recommended Hotels Nearby</Text>
            {data.hotels.map((hotel: Hotel, i: number) => (
              <View key={i} style={{ flexDirection: 'row', backgroundColor: '#0f172a', borderRadius: 16, overflow: 'hidden', marginBottom: 15 }}>
                <ImageBackground source={{ uri: hotel.image }} style={{ width: 100, height: 100 }} />
                <View style={{ padding: 15, flex: 1, justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{hotel.name}</Text>
                  <Text style={{ color: '#10b981', fontSize: 14, marginTop: 5 }}>₹{hotel.price}</Text>
                  <Text style={{ color: '#fbbf24', fontSize: 12, marginTop: 5 }}>★ {hotel.rating || '4.5'}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

