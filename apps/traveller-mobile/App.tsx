import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ImageBackground, TouchableOpacity, StatusBar, TextInput, ActivityIndicator, Platform, Linking, Alert, BackHandler, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { io, Socket } from 'socket.io-client';
import { WebView } from 'react-native-webview';
const isWeb = Platform.OS === 'web';

// --- TYPES ---
interface Destination {
  id: string;
  name: string;
  state?: string;
  rating?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  type?: string;
  placesToVisit?: Place[];
  hotels?: Hotel[];
}

interface Place {
  name: string;
  description: string;
  image: string;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  price: string;
  image: string;
  rating: string;
}

interface HomeScreenProps {
  destinations: Destination[];
  onNavigateToDetail: (id: string) => void;
  onStartAI: () => void;
  onNavigate: (screen: string) => void;
}

interface DestinationsScreenProps {
  destinations: Destination[];
  onNavigateToDetail: (id: string) => void;
}

interface DestinationDetailProps {
  destinationId: string;
  onBack: () => void;
}

// --- DATA ---
const DESTINATIONS_FALLBACK: Destination[] = [
  { id: '1', name: 'Rajkot', state: 'Gujarat', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80', rating: '4.5', type: 'Trending', description: 'Cultural hub of Saurashtra with amazing food and heritage.' },
  { id: '2', name: 'Dwarka', state: 'Gujarat', image: 'https://images.unsplash.com/photo-1629813358055-6677e81b66b8?q=80', rating: '4.9', type: 'Heritage', description: 'Ancient sacred city of Lord Krishna.' },
  { id: '3', name: 'Goa', state: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80', rating: '4.8', type: 'Romantic', description: 'Famous for its beautiful beaches, nightlife, and Portuguese heritage.' },
  { id: '4', name: 'Rajasthan', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80', rating: '4.9', type: 'Heritage', description: 'The land of kings, famous for massive forts and royal palaces.' },
  { id: '5', name: 'Kerala', state: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80', rating: '4.9', type: 'Romantic', description: 'Gods Own Country, famous for its backwaters and lush green landscapes.' },
  { id: '6', name: 'Agra', state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1564507592227-cb84b196a8ee?q=80', rating: '4.7', type: 'Heritage', description: 'Home to the iconic Taj Mahal, a symbol of eternal love.' },
  { id: '7', name: 'Manali', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80', rating: '4.8', type: 'Adventure', description: 'A high-altitude Himalayan resort town known for backpacking.' },
  { id: '8', name: 'Andaman', state: 'Andaman', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80', rating: '4.9', type: 'Trending', description: 'Pristine beaches, crystal clear waters, and world-class scuba diving.' }
];

const HOTELS: Hotel[] = [
  { id: '1', name: 'Taj Lake Palace', location: 'Udaipur', price: '₹35,000/night', image: 'https://images.unsplash.com/photo-1542314831-c6a4d142104d?q=80', rating: '4.9' },
  { id: '2', name: 'W Goa', location: 'Goa', price: '₹18,000/night', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80', rating: '4.7' },
  { id: '3', name: 'The Oberoi Cecil', location: 'Shimla', price: '₹22,000/night', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80', rating: '4.8' },
];

import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen: React.FC<HomeScreenProps> = ({ destinations, onNavigateToDetail, onStartAI, onNavigate }) => (
  <ImageBackground 
    source={{ uri: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80' }} 
    style={{ flex: 1, width: '100%' }}
  >
    <LinearGradient
      colors={['rgba(2, 6, 23, 0.6)', 'rgba(2, 6, 23, 0.9)']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 }}>
          <View style={{ backgroundColor: 'rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.3)', borderWidth: 1, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginBottom: 30, shadowColor: '#6366f1', shadowOpacity: 0.2, shadowRadius: 10 }}>
            <Text style={{ color: '#a5b4fc', fontWeight: 'bold', fontSize: 12 }}>✨ Revolutionizing Travel in 2026</Text>
          </View>

          <Text style={{ fontSize: 48, fontWeight: '900', color: '#ffffff', textAlign: 'center', lineHeight: 55 }}>
            Experience{'\n'}
            <Text style={{ color: '#c084fc' }}>YatraSangi</Text>
          </Text>

          <Text style={{ color: '#cbd5e1', textAlign: 'center', fontSize: 16, marginTop: 20, lineHeight: 24, paddingHorizontal: 10 }}>
            Zero commissions. Direct bookings. Intelligent AI routing.{'\n'}Your ultimate personalized travel companion.
          </Text>

          <TouchableOpacity 
            onPress={onStartAI}
            style={{ width: '100%', marginTop: 30, shadowColor: '#4f46e5', shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 }}>
            <LinearGradient
              colors={['#4f46e5', '#6366f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 18, borderRadius: 16, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>✨ Start AI Planning</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Links Grid */}
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: isWeb ? 'center' : 'space-between', gap: 15 }}>
          {[
            { icon: '📍', label: 'Destinations', action: () => onNavigate('Destinations') },
            { icon: '🏨', label: 'Hotels', action: () => onNavigate('Hotels') },
            { icon: '🚕', label: 'Outstation Cabs', action: () => onNavigate('Cabs') },
            { icon: '🍽️', label: 'Restaurants', action: () => onNavigate('Restaurants') },
            { icon: '🛺 🛵 🚗', label: 'Local Rides', action: () => onNavigate('Local Rides') },
            { icon: '🌴', label: 'Tour Packages', action: () => onNavigate('Packages') },
          ].map((item, idx) => {
            const isLocalRides = item.label === 'Local Rides';
            return (
              <TouchableOpacity 
                key={idx} 
                onPress={item.action} 
                style={{ 
                  width: isWeb ? 160 : '47%', 
                  backgroundColor: isLocalRides ? 'rgba(250, 204, 21, 0.1)' : 'rgba(30, 41, 59, 0.4)', 
                  borderColor: isLocalRides ? 'rgba(250, 204, 21, 0.5)' : 'rgba(255,255,255,0.1)', 
                  borderWidth: 1, 
                  borderRadius: 20, 
                  paddingVertical: 25, 
                  alignItems: 'center', 
                  marginBottom: 15,
                  overflow: 'hidden'
                }}
              >
                {isLocalRides && (
                  <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4, borderColor: 'rgba(239, 68, 68, 0.3)', borderWidth: 1 }}>
                    <View style={{ width: 6, height: 6, backgroundColor: '#ef4444', borderRadius: 3 }} />
                    <Text style={{ color: '#ef4444', fontSize: 10, fontWeight: 'bold' }}>LIVE</Text>
                  </View>
                )}
                <Text style={{ fontSize: isLocalRides ? 24 : 32, marginBottom: 10 }}>{item.icon}</Text>
                <Text style={{ color: isLocalRides ? '#fde047' : '#e2e8f0', fontWeight: 'bold', fontSize: 14 }}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Why YatraSangi Section */}
        <View style={{ marginTop: 40, paddingHorizontal: 20, paddingBottom: 60, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 60, maxWidth: 1200, alignSelf: 'center', width: '100%' }}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: 10 }}>Why YatraSangi?</Text>
            <Text style={{ color: '#94a3b8', textAlign: 'center', fontSize: 18 }}>The most transparent way to travel.</Text>
          </View>

          <View style={{ flexDirection: isWeb ? 'row' : 'column', gap: 30 }}>
            {[
              { title: '0% Commission', desc: 'Book directly with local businesses. We charge absolutely zero platform fees.', icon: '💸', colors: ['rgba(16, 185, 129, 0.2)', 'rgba(20, 184, 166, 0.05)'], action: () => onNavigate('Hotels') },
              { title: 'AI Routing', desc: 'Instantly generate multi-city travel routes that save you time and money.', icon: '🧠', colors: ['rgba(99, 102, 241, 0.2)', 'rgba(168, 85, 247, 0.05)'], action: () => onStartAI() },
              { title: 'Live Broadcast', desc: 'Request local rides and watch drivers compete to accept your trip instantly.', icon: '📡', colors: ['rgba(234, 179, 8, 0.2)', 'rgba(249, 115, 22, 0.05)'], action: () => onNavigate('Local Rides') },
            ].map((feature, i) => (
              <TouchableOpacity key={i} onPress={feature.action} style={{ flex: isWeb ? 1 : undefined }} activeOpacity={0.7}>
                <LinearGradient colors={feature.colors as any} style={{ flex: 1, padding: 30, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <View style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', width: 70, height: 70, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 }}>
                    <Text style={{ fontSize: 32 }}>{feature.icon}</Text>
                  </View>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>{feature.title}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 16, lineHeight: 24 }}>{feature.desc}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer matching Next.js Web App exactly */}
        <View style={{ backgroundColor: '#020617', paddingVertical: 50, paddingHorizontal: 30, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }}>
          <View style={{ flexDirection: isWeb ? 'row' : 'column', maxWidth: 1200, alignSelf: 'center', width: '100%', justifyContent: 'space-between', gap: 40 }}>
            <View style={{ flex: isWeb ? 1.5 : undefined }}>
              <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>YatraSangi</Text>
              <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 22, paddingRight: 20 }}>Your ultimate companion for planning trips, booking stays, and finding reliable rides across India.</Text>
            </View>
            
            <View style={{ flex: isWeb ? 1 : undefined }}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Quick Links</Text>
              {[
                { name: 'Top Destinations', screen: 'Destinations' },
                { name: 'Trip Planner AI', screen: 'Trip Planner' },
                { name: 'Luxury Hotels', screen: 'Hotels' },
                { name: 'Book a Cab', screen: 'Cabs' },
                { name: 'Partner Login', screen: 'PartnerLogin' }
              ].map(link => (
                <TouchableOpacity key={link.name} onPress={() => link.name === 'Trip Planner AI' ? onStartAI() : onNavigate(link.screen)} style={{ marginBottom: 10 }}>
                  <Text style={{ color: '#94a3b8', fontSize: 14 }}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flex: isWeb ? 1.5 : undefined }}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Customer Reviews</Text>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                <Text style={{ color: '#cbd5e1', fontSize: 13, fontStyle: 'italic', marginBottom: 8 }}>"Best travel planning app! Saved me hours of research."</Text>
                <Text style={{ color: '#fbbf24', fontSize: 12 }}>★★★★★ - Rahul M.</Text>
              </View>
            </View>

            <View style={{ flex: isWeb ? 1 : undefined }}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Contact & Support</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Customer Care:</Text>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>+91 93772 39439</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => Linking.openURL('tel:+919377239439')} style={{ backgroundColor: '#4f46e5', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12 }}><Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Call</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('whatsapp://send?phone=919377239439')} style={{ backgroundColor: '#10b981', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12 }}><Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>WhatsApp</Text></TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', marginTop: 40, paddingTop: 20, flexDirection: isWeb ? 'row' : 'column', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, alignSelf: 'center', width: '100%' }}>
            <Text style={{ color: '#64748b', fontSize: 12 }}>© 2026 YatraSangi. All rights reserved.</Text>
            
            <View style={{ flexDirection: isWeb ? 'row' : 'column', alignItems: 'center', marginTop: isWeb ? 0 : 25, gap: 10 }}>
              <Text style={{ color: '#94a3b8', fontSize: 14, fontWeight: '500' }}>Developed with ❤️ by</Text>
              
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(113, 63, 18, 0.4)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.5)', shadowColor: '#eab308', shadowOpacity: 0.3, shadowRadius: 10 }}>
                <Image source={require('./assets/logo.jpg')} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#facc15', marginRight: 12 }} />
                <View>
                  <Text style={{ color: '#fef08a', fontWeight: '900', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>Golden Sparrow</Text>
                  <Text style={{ color: '#eab308', fontWeight: 'bold', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', marginTop: 2 }}>Softech</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </LinearGradient>
  </ImageBackground>
);

const DestinationsScreen: React.FC<DestinationsScreenProps> = ({ destinations, onNavigateToDetail }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const categories = ['All', 'Trending', 'Romantic', 'Adventure', 'Heritage'];

  const filtered = activeTab === 'All' ? destinations : destinations.filter((d: Destination) => d.type === activeTab);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore <Text style={styles.textEmerald}>Destinations</Text></Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer} contentContainerStyle={styles.tabsContent}>
        {categories.map(cat => (
          <TouchableOpacity key={cat} onPress={() => setActiveTab(cat)} style={[styles.tab, activeTab === cat && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === cat && styles.activeTabText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.cardsContainer}>
        {filtered.map((dest: Destination) => (
          <TouchableOpacity key={dest.id || dest.name} style={styles.card} activeOpacity={0.9} onPress={() => onNavigateToDetail(dest.id)}>
            <ImageBackground source={{ uri: dest.image || DESTINATIONS_FALLBACK[0].image }} style={styles.cardImage} imageStyle={{ borderRadius: 24 }}>
              <View style={styles.overlay}>
                <View style={styles.tagContainer}><Text style={styles.tagText}>{dest.type || 'Trending'}</Text></View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{dest.name}</Text>
                  <Text style={styles.cardSubtitle}>{dest.subtitle || dest.description || 'Amazing destination'}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const DestinationDetailScreen: React.FC<DestinationDetailProps> = ({ destinationId, onBack }) => {
  const [data, setData] = useState<Destination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const apiUrl = isWeb ? 'http://localhost:3004' : 'http://192.168.1.111:3004';
    
    fetch(`${apiUrl}/destinations/${destinationId}`)
      .then(res => res.json())
      .then(json => {
        if (json.statusCode >= 400 || !json.name) {
          const fallback = DESTINATIONS_FALLBACK.find(d => d.id === destinationId) || DESTINATIONS_FALLBACK[0];
          setData(fallback);
        } else {
          setData(json);
        }
      })
      .catch(err => {
        console.error('Failed to fetch destination details, using fallback:', err);
        const fallback = DESTINATIONS_FALLBACK.find(d => d.id === destinationId) || DESTINATIONS_FALLBACK[0];
        setData(fallback);
      })
      .finally(() => setLoading(false));
  }, [destinationId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#34d399" />
        <Text style={{ color: '#34d399', fontSize: 18, marginTop: 15 }}>Fetching details...</Text>
      </View>
    );
  }

  if (!data) return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text style={{ color: 'white' }}>Error loading data</Text></View>;

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <ImageBackground source={{ uri: data.placesToVisit?.[0]?.image || 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80' }} style={{ height: 350, justifyContent: 'flex-start', paddingTop: 40, paddingHorizontal: 20 }}>
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
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>Recommended Hotels</Text>
            {data.hotels.map((hotel: Hotel, i: number) => (
              <View key={i} style={{ flexDirection: 'row', backgroundColor: '#0f172a', borderRadius: 16, overflow: 'hidden', marginBottom: 15 }}>
                <ImageBackground source={{ uri: hotel.image }} style={{ width: 100, height: 100 }} />
                <View style={{ padding: 15, flex: 1, justifyContent: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{hotel.name}</Text>
                  <Text style={{ color: '#10b981', fontSize: 14, marginTop: 5 }}>{hotel.price}</Text>
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

const HotelsScreen = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackHotels = [
    {
      id: 1,
      name: 'The Leela Palace',
      location: 'Udaipur, Rajasthan',
      rating: 4.9,
      reviews: 1240,
      price: 18500,
      image: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80',
      amenities: ['Pool', 'Spa', 'Lake View'],
    },
    {
      id: 2,
      name: 'Taj Mahal Tower',
      location: 'Mumbai, Maharashtra',
      rating: 4.8,
      reviews: 3200,
      price: 15200,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80',
      amenities: ['Sea View', 'Gym', 'Restaurant'],
    },
    {
      id: 3,
      name: 'Rambagh Palace',
      location: 'Jaipur, Rajasthan',
      rating: 4.9,
      reviews: 890,
      price: 22000,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80',
      amenities: ['Heritage', 'Pool', 'Fine Dining'],
    }
  ];

  useEffect(() => {
    fetch('http://192.168.1.111:3004/hotels')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setHotels(data);
        } else {
          setHotels(fallbackHotels);
        }
      })
      .catch(() => {
        console.log('Backend not reachable, using fallback data');
        setHotels(fallbackHotels);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>Luxury <Text style={{ color: '#10b981' }}>Hotels</Text></Text>
      <Text style={{ color: '#94a3b8', marginBottom: 20 }}>Find the best stays curated for your comfort.</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" style={{ marginTop: 50 }} />
      ) : (
        hotels.map((hotel) => (
          <View key={hotel.id} style={{ backgroundColor: '#1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <ImageBackground source={{ uri: hotel.image || 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80' }} style={{ width: '100%', height: 200 }} />
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', flex: 1 }}>{hotel.name}</Text>
                <View style={{ backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>★ {hotel.rating || 4.5}</Text>
                </View>
              </View>
              <Text style={{ color: '#94a3b8', fontSize: 14, marginVertical: 5 }}>📍 {hotel.location} ({(hotel.reviews || 0)} reviews)</Text>
              
              <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
                {(hotel.amenities || ['WiFi', 'AC', 'Room Service']).map((amenity: string) => (
                  <Text key={amenity} style={{ color: '#c084fc', fontSize: 12, backgroundColor: 'rgba(192, 132, 252, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>{amenity}</Text>
                ))}
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>₹{hotel.price}<Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: 'normal' }}> / night</Text></Text>
                <TouchableOpacity style={{ backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const CabsScreen = () => {
  const [cabs, setCabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackCabs = [
    { id: '1', name: 'Royal Cabs', type: 'SUV (Innova)', location: 'Delhi NCR', rating: 4.8, price: 15, perKm: true, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80' },
    { id: '2', name: 'Shiv Taxi Service', type: 'Sedan (Dzire)', location: 'Mumbai', rating: 4.6, price: 12, perKm: true, image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80' },
  ];

  useEffect(() => {
    fetch('http://192.168.1.111:3004/taxis')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setCabs(data);
        else setCabs(fallbackCabs);
      })
      .catch(() => {
        console.log('Backend not reachable, using fallback data for cabs');
        setCabs(fallbackCabs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80' }} 
        style={{ width: '100%', padding: 30, paddingVertical: 50 }}
        imageStyle={{ opacity: 0.4 }}
      >
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 20 }}>Book Your <Text style={{ color: '#6366f1' }}>Ride</Text></Text>
        
        <View style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155' }}>
          <TextInput placeholder="Pickup Location" placeholderTextColor="#64748b" style={{ backgroundColor: '#020617', color: 'white', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#334155' }} />
          <TextInput placeholder="Drop-off Location" placeholderTextColor="#64748b" style={{ backgroundColor: '#020617', color: 'white', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#334155' }} />
          <TouchableOpacity style={{ backgroundColor: '#4f46e5', padding: 15, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Find Cabs</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={{ padding: 20 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#4f46e5" />
        ) : (
          cabs.map((cab) => (
            <View key={cab.id} style={{ backgroundColor: '#1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 20, flexDirection: 'row' }}>
              <Image source={{ uri: cab.image }} style={{ width: 120, height: '100%' }} />
              <View style={{ padding: 15, flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{cab.name}</Text>
                    <Text style={{ color: '#c084fc', fontSize: 12, fontWeight: 'bold' }}>{cab.type}</Text>
                  </View>
                  <View style={{ backgroundColor: '#10b981', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>★ {cab.rating}</Text>
                  </View>
                </View>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginVertical: 8 }}>📍 {cab.location}</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>₹{cab.price}<Text style={{ fontSize: 10, color: '#94a3b8', fontWeight: 'normal' }}>{cab.perKm ? '/km' : '/trip'}</Text></Text>
                  <TouchableOpacity style={{ backgroundColor: '#4f46e5', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Book</Text>
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

const RestaurantsScreen = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackRestaurants = [
    { id: 1, name: 'Gordhan Thal', location: 'Ahmedabad, Gujarat', rating: 4.8, reviews: 3200, avgCostForTwo: 1200, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80', cuisineType: 'Authentic Gujarati Thali', vegOnly: true },
    { id: 2, name: 'Punjabi Nature', location: 'Rajkot, Gujarat', rating: 4.6, reviews: 1850, avgCostForTwo: 900, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80', cuisineType: 'North Indian, Punjabi', vegOnly: true },
    { id: 3, name: 'The Dass Prakash', location: 'Dwarka, Gujarat', rating: 4.9, reviews: 4200, avgCostForTwo: 600, image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?q=80', cuisineType: 'South Indian, Snacks', vegOnly: true },
  ];

  useEffect(() => {
    fetch('http://192.168.1.111:3004/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data && data.length > 0 ? data : fallbackRestaurants))
      .catch(() => setRestaurants(fallbackRestaurants))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>Local <Text style={{ color: '#f43f5e' }}>Restaurants</Text></Text>
      <Text style={{ color: '#94a3b8', marginBottom: 20 }}>Discover top-rated food near your destination.</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#f43f5e" />
      ) : (
        restaurants.map((rest) => (
          <View key={rest.id} style={{ backgroundColor: '#1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <ImageBackground source={{ uri: rest.image }} style={{ width: '100%', height: 180 }}>
              {rest.vegOnly && (
                <View style={{ position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(16, 185, 129, 0.9)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: 'white' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>🟢 PURE VEG</Text>
                </View>
              )}
            </ImageBackground>
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', flex: 1 }}>{rest.name}</Text>
                <View style={{ backgroundColor: '#10b981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>★ {rest.rating}</Text>
                </View>
              </View>
              <Text style={{ color: '#94a3b8', fontSize: 14, marginVertical: 5 }}>{rest.cuisineType}</Text>
              <Text style={{ color: '#cbd5e1', fontSize: 12, marginBottom: 15 }}>📍 {rest.location} • {rest.reviews} reviews</Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 15 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>₹{rest.avgCostForTwo} <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: 'normal' }}>for two</Text></Text>
                <TouchableOpacity style={{ backgroundColor: '#f43f5e', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>View Menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const PackagesScreen = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackPackages = [
    { id: 1, title: "Goa Weekend Getaway", duration: "4 Days / 3 Nights", price: 12500, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80", rating: 4.8, features: ["Hotel", "Sightseeing", "Breakfast"], vendorName: "Goa Beach Travels" },
    { id: 2, title: "Manali Snow Adventure", duration: "6 Days / 5 Nights", price: 18900, image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80", rating: 4.9, features: ["3 Star Hotel", "Snow Activities", "Meals"], vendorName: "Himalayan Trekkers" },
    { id: 3, title: "Kerala Backwaters", duration: "5 Days / 4 Nights", price: 16500, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80", rating: 4.7, features: ["Houseboat", "All Meals", "Spa"], vendorName: "God's Own Holidays" }
  ];

  useEffect(() => {
    fetch('http://192.168.1.111:3004/packages')
      .then(res => res.json())
      .then(data => setPackages(data && data.length > 0 ? data : fallbackPackages))
      .catch(() => setPackages(fallbackPackages))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>Exclusive <Text style={{ color: '#10b981' }}>Packages</Text></Text>
      <Text style={{ color: '#94a3b8', marginBottom: 20 }}>0% Commission. Best Prices Guaranteed.</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#10b981" />
      ) : (
        packages.map((pkg) => (
          <View key={pkg.id} style={{ backgroundColor: '#1e293b', borderRadius: 16, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: '#334155' }}>
            <ImageBackground source={{ uri: pkg.image }} style={{ width: '100%', height: 220, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 15 }}>
              <View style={{ backgroundColor: 'rgba(2, 6, 23, 0.8)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#334155' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{pkg.duration}</Text>
              </View>
            </ImageBackground>
            <View style={{ padding: 15 }}>
              <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', marginBottom: 5 }}>{pkg.title}</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ color: '#fbbf24', fontSize: 12 }}>★ {pkg.rating}</Text>
                <Text style={{ color: '#64748b', fontSize: 12, marginHorizontal: 5 }}>•</Text>
                <Text style={{ color: '#10b981', fontSize: 12, fontWeight: 'bold' }}>{pkg.vendorName}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
                {pkg.features.map((feat: string, idx: number) => (
                  <View key={idx} style={{ backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#334155' }}>
                    <Text style={{ color: '#cbd5e1', fontSize: 11 }}>{feat}</Text>
                  </View>
                ))}
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, borderTopWidth: 1, borderTopColor: '#334155', paddingTop: 15 }}>
                <View>
                  <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 2 }}>Starting from</Text>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'black' }}>₹{pkg.price.toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: '#10b981', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
      <Text style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>U</Text>
    </View>
    <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>My Profile</Text>
    <Text style={{ fontSize: 16, color: '#94a3b8', marginTop: 10 }}>User account details coming soon!</Text>
  </View>
);

const AITripPlannerScreen = ({ onNavigate }: { onNavigate: (screen: string) => void }) => {
  const [cities, setCities] = useState<{name: string, lat: string, lon: string}[]>([
    { name: 'Rajkot', lat: '22.3039', lon: '70.8022' },
    { name: 'Dwarka', lat: '22.2442', lon: '68.9685' },
    { name: 'Somnath', lat: '20.8880', lon: '70.4012' }
  ]);
  const [newCity, setNewCity] = useState('');
  const [generating, setGenerating] = useState(false);
  const [routeResult, setRouteResult] = useState<any>(null);

  const addCity = async () => {
    if (newCity.trim()) {
      const cityName = newCity.trim();
      setNewCity('');
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1&countrycodes=in`, {
          headers: {
            'User-Agent': 'YatraSangiTravelApp/1.0'
          }
        });
        const data = await res.json();
        if (data && data.length > 0 && data[0].lat) {
          setCities([...cities, { name: data[0].display_name.split(',')[0], lat: data[0].lat, lon: data[0].lon }]);
        } else {
          alert('City not found!');
        }
      } catch (err) {
        console.error(err);
        alert('Error finding city details. Try again.');
      }
    }
  };

  const removeCity = (index: number) => {
    const newCities = cities.filter((_, i) => i !== index);
    setCities(newCities);
  };

  const handleGenerate = async () => {
    if (cities.length < 2) {
      alert('Please add at least 2 cities to plan a route.');
      return;
    }
    setGenerating(true);
    setRouteResult(null);
    
    // AI Route Optimization (Nearest Neighbor + 2-Opt)
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let unvisited = [...cities.slice(1)];
    let optimized = [cities[0]];
    let current = cities[0];

    let isRoundTrip = false;
    let startNodeCopy = null;

    const startName = cities[0].name.toLowerCase().trim();
    const duplicateIndex = unvisited.findIndex(d => d.name.toLowerCase().trim() === startName);

    if (duplicateIndex !== -1) {
      isRoundTrip = true;
      startNodeCopy = unvisited[duplicateIndex];
      unvisited.splice(duplicateIndex, 1);
    }

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;
      for (let i = 0; i < unvisited.length; i++) {
        const d = getDistance(parseFloat(current.lat), parseFloat(current.lon), parseFloat(unvisited[i].lat), parseFloat(unvisited[i].lon));
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }
      current = unvisited[nearestIdx];
      optimized.push(current);
      unvisited.splice(nearestIdx, 1);
    }

    const calculateRouteDist = (route: typeof cities) => {
      let dist = 0;
      for (let i = 0; i < route.length - 1; i++) {
        dist += getDistance(parseFloat(route[i].lat), parseFloat(route[i].lon), parseFloat(route[i + 1].lat), parseFloat(route[i + 1].lon));
      }
      return dist;
    };

    let improved = true;
    let bestDistance = calculateRouteDist(optimized);

    while (improved) {
      improved = false;
      for (let i = 1; i < optimized.length - 1; i++) {
        for (let j = i + 1; j < optimized.length; j++) {
          const newRoute = [...optimized.slice(0, i), ...optimized.slice(i, j + 1).reverse(), ...optimized.slice(j + 1)];
          const newDistance = calculateRouteDist(newRoute);
          if (newDistance < bestDistance - 0.001) {
            optimized = newRoute;
            bestDistance = newDistance;
            improved = true;
          }
        }
      }
    }

    if (isRoundTrip && startNodeCopy) {
      optimized.push(startNodeCopy);
      bestDistance += getDistance(parseFloat(optimized[optimized.length - 2].lat), parseFloat(optimized[optimized.length - 2].lon), parseFloat(startNodeCopy.lat), parseFloat(startNodeCopy.lon));
    }

    setCities(optimized);
    
    try {
      const coords = optimized.map(c => `${c.lon},${c.lat}`).join(';');
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=false`);
      const data = await res.json();
      
      if (data.code === 'Ok') {
        const distanceKm = data.routes[0].distance / 1000;
        const timeHours = data.routes[0].duration / 3600;
        const taxiCost = Math.round(distanceKm * 12); // Assume ₹12 per km

        setRouteResult({
          distance: `${Math.round(distanceKm)} km`,
          time: `${Math.floor(timeHours)} hrs ${Math.round((timeHours % 1) * 60)} mins`,
          stops: optimized.length,
          cost: `₹ ${taxiCost.toLocaleString('en-IN')}`
        });
      } else {
        throw new Error('OSRM failed');
      }
    } catch (err) {
      const timeHours = Math.round((bestDistance / 60) * 10) / 10;
      const taxiCost = Math.round(bestDistance * 12);
      setRouteResult({
        distance: `~${Math.round(bestDistance)} km (Straight line)`,
        time: `${Math.floor(timeHours)} hrs ${Math.round((timeHours % 1) * 60)} mins`,
        stops: optimized.length,
        cost: `₹ ${taxiCost.toLocaleString('en-IN')}`
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80' }} 
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: Platform.OS === 'web' ? 'row' : 'column' }}>
        
        {/* LEFT PANEL (Input Form) */}
        <View style={{ flex: Platform.OS === 'web' ? 0.35 : 1, backgroundColor: 'rgba(23, 23, 23, 0.9)', padding: 30, borderRightWidth: Platform.OS === 'web' ? 1 : 0, borderBottomWidth: Platform.OS !== 'web' ? 1 : 0, borderColor: '#333' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>Build Itinerary</Text>
          <Text style={{ color: '#a3a3a3', fontSize: 13, marginBottom: 30 }}>Add cities and let our AI optimize the route.</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {cities.map((city, idx) => (
              <View key={idx} style={{ marginBottom: 15 }}>
                <Text style={{ color: '#6366f1', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 5, textTransform: 'uppercase' }}>
                  {idx === 0 ? 'STARTING POINT' : `STOP ${idx}`}
                </Text>
                <View style={{ flexDirection: 'row', backgroundColor: '#171717', borderRadius: 8, borderWidth: 1, borderColor: '#262626', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 }}>
                  <Text style={{ color: 'white', flex: 1, fontWeight: '600' }}>{city.name}</Text>
                  {idx > 0 && (
                    <TouchableOpacity onPress={() => removeCity(idx)}>
                      <Text style={{ color: '#525252', fontWeight: 'bold', fontSize: 16 }}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <Text style={{ color: '#6366f1', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 5, marginTop: 10, textTransform: 'uppercase' }}>
              ADD NEXT DESTINATION
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput 
                placeholder="Search any city in India..."
                placeholderTextColor="#525252"
                value={newCity}
                onChangeText={setNewCity}
                style={{ flex: 1, backgroundColor: '#171717', color: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#262626' }}
              />
              <TouchableOpacity onPress={addCity} style={{ backgroundColor: '#6366f1', justifyContent: 'center', paddingHorizontal: 20, borderRadius: 8 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleGenerate} style={{ backgroundColor: '#6366f1', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 40, flexDirection: 'row', justifyContent: 'center' }}>
              {generating ? <ActivityIndicator color="white" /> : <><Text style={{ marginRight: 10 }}>✨</Text><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Optimize Route</Text></>}
            </TouchableOpacity>

          </ScrollView>
        </View>

        {/* RIGHT PANEL (Map View & Results) */}
        <View style={{ flex: Platform.OS === 'web' ? 0.65 : 1, backgroundColor: '#e5e5e5', position: 'relative' }}>
           <WebView
             originWhitelist={['*']}
             source={{ html: `
               <!DOCTYPE html>
               <html>
               <head>
                 <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                 <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
                 <style>
                   body { padding: 0; margin: 0; }
                   html, body, #map { height: 100%; width: 100vw; background: #0f172a; }
                 </style>
               </head>
               <body>
                 <div id="map"></div>
                 <script>
                   var map = L.map('map', { zoomControl: false }).setView([22.5, 75.0], 6);
                   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                     attribution: 'Map data &copy; OpenStreetMap contributors'
                   }).addTo(map);

                   var markers = ${JSON.stringify(cities)};
                   
                   if (markers.length > 0) {
                     var latlngs = markers.map(function(m) { return [parseFloat(m.lat), parseFloat(m.lon)]; });
                     var bounds = L.latLngBounds(latlngs);
                     
                     markers.forEach(function(m) {
                       L.marker([parseFloat(m.lat), parseFloat(m.lon)]).addTo(map).bindPopup(m.name);
                     });

                     if (latlngs.length > 1) {
                       L.polyline(latlngs, { color: '#4f46e5', weight: 4, dashArray: '10, 10' }).addTo(map);
                     }
                     
                     map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
                   }
                 </script>
               </body>
               </html>
             ` }}
             style={{ flex: 1, width: '100%', height: '100%' }}
           />

           {routeResult && (
             <View style={{ position: 'absolute', bottom: 0, width: '100%', padding: 20, alignItems: 'center' }}>
               <View style={{ backgroundColor: '#0f172a', padding: 25, borderRadius: 16, width: '100%', maxWidth: 400, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 }}>
                 <View style={{ width: 48, height: 48, backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: 24, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 15 }}>
                   <Text style={{ color: '#34d399', fontSize: 24 }}>✓</Text>
                 </View>
                 <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 }}>Route Optimized!</Text>
                 <Text style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 25 }}>Best path for {routeResult.stops} locations.</Text>
                   
                   <View style={{ marginBottom: 25 }}>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 12, marginBottom: 12 }}>
                       <Text style={{ color: '#94a3b8', fontSize: 14 }}>Total Distance</Text>
                       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{routeResult.distance}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 12, marginBottom: 12 }}>
                       <Text style={{ color: '#94a3b8', fontSize: 14 }}>Travel Time</Text>
                       <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{routeResult.time}</Text>
                     </View>
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                       <Text style={{ color: '#94a3b8', fontSize: 14 }}>Taxi Estimate</Text>
                       <Text style={{ color: '#34d399', fontWeight: 'bold', fontSize: 14 }}>{routeResult.cost}</Text>
                     </View>
                   </View>

                   <TouchableOpacity onPress={() => onNavigate('Hotels')} style={{ backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 }}>
                     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Find Hotels on Route</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => onNavigate('Cabs')} style={{ backgroundColor: '#1e293b', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 }}>
                     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Book Taxi</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/dir/${cities.map(c => encodeURIComponent(c.name)).join('/')}`)} style={{ backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                     <Text style={{ marginRight: 8, fontSize: 16 }}>🌍</Text>
                     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>Open in Google Maps</Text>
                   </TouchableOpacity>

                 <TouchableOpacity onPress={() => setRouteResult(null)} style={{ marginTop: 15, paddingVertical: 10, alignItems: 'center' }}>
                   <Text style={{ color: '#94a3b8', fontSize: 14 }}>Close & Edit Route</Text>
                 </TouchableOpacity>
               </View>
             </View>
           )}
        </View>
        
      </View>
    </ImageBackground>
  );
};

const CustomRouteScreen = () => {
  const [cities, setCities] = useState(['Rajkot', 'Dwarka']);
  const [newCity, setNewCity] = useState('');

  const addCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim())) {
      setCities([...cities, newCity.trim()]);
      setNewCity('');
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newCities = [...cities];
    [newCities[index - 1], newCities[index]] = [newCities[index], newCities[index - 1]];
    setCities(newCities);
  };

  const moveDown = (index: number) => {
    if (index === cities.length - 1) return;
    const newCities = [...cities];
    [newCities[index + 1], newCities[index]] = [newCities[index], newCities[index + 1]];
    setCities(newCities);
  };

  const removeCity = (index: number) => {
    const newCities = cities.filter((_, i) => i !== index);
    setCities(newCities);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 10 }}>Build Your <Text style={{ color: '#10b981' }}>Own Route</Text></Text>
      <Text style={{ color: '#94a3b8', marginBottom: 30 }}>Set which city comes first, second, etc. We will calculate the best path.</Text>
      
      {/* Add City Input */}
      <View style={{ flexDirection: 'row', marginBottom: 30, gap: 10 }}>
        <TextInput 
          placeholder="Enter city (e.g. Somnath)"
          placeholderTextColor="#64748b"
          value={newCity}
          onChangeText={setNewCity}
          style={{ flex: 1, backgroundColor: '#0f172a', color: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#334155' }}
        />
        <TouchableOpacity onPress={addCity} style={{ backgroundColor: '#10b981', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 12 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* City List */}
      <View style={{ backgroundColor: 'rgba(30, 41, 59, 0.4)', borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#334155' }}>
        {cities.map((city, index) => (
          <View key={city} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#020617', padding: 15, borderRadius: 12, marginBottom: index !== cities.length - 1 ? 10 : 0, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
            <View style={{ backgroundColor: '#10b981', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{index + 1}</Text>
            </View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1 }}>{city}</Text>
            
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <TouchableOpacity onPress={() => moveUp(index)} disabled={index === 0} style={{ padding: 8, backgroundColor: index === 0 ? '#1e293b' : '#334155', borderRadius: 8 }}>
                <Text style={{ color: index === 0 ? '#475569' : 'white' }}>↑</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveDown(index)} disabled={index === cities.length - 1} style={{ padding: 8, backgroundColor: index === cities.length - 1 ? '#1e293b' : '#334155', borderRadius: 8 }}>
                <Text style={{ color: index === cities.length - 1 ? '#475569' : 'white' }}>↓</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeCity(index)} style={{ padding: 8, backgroundColor: '#ef4444', borderRadius: 8, marginLeft: 5 }}>
                <Text style={{ color: 'white' }}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {cities.length > 1 && (
        <TouchableOpacity style={{ backgroundColor: '#4f46e5', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 30 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Calculate Fare & Route Map</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const API_BASE_URL = isWeb ? 'http://localhost:3004' : 'http://192.168.1.111:3004';

const GenericListScreen = ({ endpoint, title, icon, subtitle }: { endpoint: string, title: string, icon: string, subtitle: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/${endpoint}`)
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [endpoint]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617' }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>{icon} {title}</Text>
      <Text style={{ color: '#94a3b8', marginBottom: 20 }}>{subtitle}</Text>
      
      {loading ? <ActivityIndicator color="#10b981" /> : (
        <View style={{ gap: 20 }}>
          {data.map((item, idx) => (
            <View key={item.id || idx} style={{ backgroundColor: '#0f172a', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1e293b' }}>
              <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80' }} style={{ width: '100%', height: 180 }} />
              <View style={{ padding: 15 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{item.name || item.title || item.driverName}</Text>
                {item.location && <Text style={{ color: '#94a3b8', marginTop: 5 }}>📍 {item.location}</Text>}
                {item.rating && <Text style={{ color: '#fbbf24', marginTop: 5 }}>★ {item.rating}</Text>}
                <Text style={{ color: '#10b981', fontWeight: 'bold', marginTop: 10 }}>
                  {item.price ? `₹${item.price}` : item.baseFare ? `₹${item.baseFare} base + ₹${item.perKmRate}/km` : item.avgCostForTwo ? `₹${item.avgCostForTwo} for two` : ''}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const LocalRidesScreen = () => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [step, setStep] = useState<'location' | 'select_vehicle' | 'searching' | 'accepted'>('location');
  const [selectedVehicle, setSelectedVehicle] = useState<'bike' | 'auto' | 'cab'>('bike');
  
  const [acceptedDriver, setAcceptedDriver] = useState<any | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    // Note: Use your machine's local IP (e.g., 192.168.x.x) if testing on physical device
    const newSocket = io('http://localhost:3004');
    setSocket(newSocket);

    newSocket.on('ride_requested', (data) => {
      setBookingId(data.id);
      // Simulate driver acceptance
      setTimeout(() => {
         newSocket.emit('accept_ride', { bookingId: data.id, driverId: "dummy-mobile-driver" });
      }, 4000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && bookingId) {
      const handleStatusUpdate = (data: any) => {
         if (data.status === 'ACCEPTED') {
           setAcceptedDriver({
             driverName: data.assignedRide?.driverName || 'Mobile Captain',
             vehicleType: data.assignedRide?.vehicleType || 'Auto',
             vehicleModel: data.assignedRide?.vehicleModel || 'Bajaj RE',
             vehicleNumber: data.assignedRide?.vehicleNumber || 'GJ01-XX-9999',
             rating: data.assignedRide?.rating || 4.9,
             otp: data.otpPin || '5678',
             contactPhone: data.assignedRide?.contactPhone || '+919876543210',
             image: 'https://images.unsplash.com/photo-1593081045266-9a5c898b671a?auto=format&fit=crop&q=80',
           });
           setStep('accepted');
         }
      };
      socket.on(`ride_status_updated_${bookingId}`, handleStatusUpdate);
      return () => { socket.off(`ride_status_updated_${bookingId}`, handleStatusUpdate); };
    }
  }, [socket, bookingId]);

  const handleBookRide = () => {
    if (socket) {
      setStep('searching');
      socket.emit('request_ride', { userId: "mobile-user", pickup, drop, vehicleType: selectedVehicle });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      {/* Map Background */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80' }}
        style={[{ flex: 1, width: '100%', height: '100%', position: 'absolute' }, step === 'searching' && { opacity: 0.5 }]}
      />
      <View style={{ flex: 1, justifyContent: 'space-between', padding: 20 }}>
        <View>
          {/* Header */}
          <View style={{ backgroundColor: 'rgba(15,23,42,0.9)', padding: 15, borderRadius: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginRight: 10 }}>🛺</Text>
            <View>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>YatraSangi Rides</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>0% Commission. Direct to Driver.</Text>
            </View>
          </View>

          {/* Location Card */}
          {(step === 'location' || step === 'select_vehicle') && (
            <View style={{ backgroundColor: 'rgba(15,23,42,0.95)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' }}>
              <TextInput 
                value={pickup} onChangeText={setPickup} 
                placeholder="Pickup Location" placeholderTextColor="#64748b"
                style={{ backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 10, marginBottom: 10 }}
              />
              <TextInput 
                value={drop} onChangeText={setDrop} 
                placeholder="Drop Destination" placeholderTextColor="#64748b"
                style={{ backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 10 }}
              />
              {step === 'location' && (
                <TouchableOpacity onPress={() => { if(pickup && drop) setStep('select_vehicle'); }} style={{ backgroundColor: '#facc15', padding: 15, borderRadius: 10, marginTop: 15, alignItems: 'center' }}>
                  <Text style={{ color: 'black', fontWeight: 'bold' }}>Find Captains</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {step === 'searching' && (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <ActivityIndicator size="large" color="#facc15" />
              <Text style={{ color: 'white', marginTop: 20, fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10 }}>Contacting nearby Captains...</Text>
            </View>
          )}
        </View>

        {/* Bottom Sheets */}
        {step === 'select_vehicle' && (
          <View style={{ backgroundColor: 'rgba(15,23,42,0.95)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' }}>
             <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 15 }}>Select Ride</Text>
             {[
               { type: 'bike', icon: '🏍️', name: 'Bike', price: '₹45', time: '1 min' },
               { type: 'auto', icon: '🛺', name: 'Auto', price: '₹80', time: '3 mins' },
               { type: 'cab', icon: '🚕', name: 'Mini Cab', price: '₹140', time: '5 mins' }
             ].map((v) => (
                <TouchableOpacity key={v.type} onPress={() => setSelectedVehicle(v.type as any)} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, backgroundColor: selectedVehicle === v.type ? 'rgba(250,204,21,0.1)' : '#1e293b', borderWidth: 1, borderColor: selectedVehicle === v.type ? '#facc15' : 'transparent', marginBottom: 10 }}>
                  <Text style={{ fontSize: 24, marginRight: 15 }}>{v.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{v.name}</Text>
                    <Text style={{ color: '#94a3b8', fontSize: 12 }}>{v.time} away</Text>
                  </View>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{v.price}</Text>
                </TouchableOpacity>
             ))}
             <TouchableOpacity onPress={handleBookRide} style={{ backgroundColor: '#facc15', padding: 15, borderRadius: 10, marginTop: 5, alignItems: 'center' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>Book {selectedVehicle.toUpperCase()}</Text>
             </TouchableOpacity>
          </View>
        )}

        {step === 'accepted' && acceptedDriver && (
          <View style={{ backgroundColor: 'rgba(15,23,42,0.95)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Arriving in 4 mins</Text>
                <Text style={{ color: '#34d399', fontWeight: 'bold' }}>Ride Accepted</Text>
              </View>
              <View style={{ backgroundColor: '#020617', padding: 10, borderRadius: 10 }}>
                <Text style={{ color: '#94a3b8', fontSize: 10 }}>OTP PIN</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, letterSpacing: 2 }}>{acceptedDriver.otp}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 15, borderRadius: 15, marginBottom: 20 }}>
              <Image source={{ uri: acceptedDriver.image }} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 15 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{acceptedDriver.driverName}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>{acceptedDriver.vehicleModel}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, backgroundColor: '#facc15', paddingHorizontal: 8, borderRadius: 5, color: 'black' }}>{acceptedDriver.vehicleNumber}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
               <TouchableOpacity onPress={() => Linking.openURL(`tel:${acceptedDriver.contactPhone}`)} style={{ flex: 1, backgroundColor: '#1e293b', padding: 15, borderRadius: 10, alignItems: 'center' }}>
                 <Text style={{ color: 'white', fontWeight: 'bold' }}>📞 Call</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${acceptedDriver.contactPhone}`)} style={{ flex: 1, backgroundColor: '#25D366', padding: 15, borderRadius: 10, alignItems: 'center' }}>
                 <Text style={{ color: 'white', fontWeight: 'bold' }}>💬 Message</Text>
               </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

// --- PARTNER DASHBOARD ---
const PartnerDashboardScreen = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [assets, setAssets] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [incomingRides, setIncomingRides] = useState<any[]>([]);
  const [vendorId] = useState('driver-mobile-001');

  useEffect(() => {
    const apiUrl = isWeb ? 'http://localhost:3004' : 'http://192.168.1.111:3004';
    const newSocket = io(apiUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Mobile Partner connected to WebSocket');
      newSocket.emit('driver_online', { driverId: vendorId });
    });

    newSocket.on('new_ride_request', (ride) => {
      console.log('New ride received in mobile app:', ride);
      setIncomingRides(prev => [...prev, ride]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [vendorId]);

  const acceptRide = (bookingId: string) => {
    if (socket) {
      socket.emit('accept_ride', { bookingId, driverId: vendorId });
      
      socket.once('ride_accepted_success', (confirmedBooking) => {
        Alert.alert('Success', 'You successfully accepted the ride!');
        setIncomingRides(prev => prev.filter(r => r.id !== bookingId));
      });
      socket.once('ride_accepted_failed', (data) => {
        Alert.alert('Failed', 'Failed to accept: ' + data.message);
        setIncomingRides(prev => prev.filter(r => r.id !== bookingId));
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Partner <Text style={styles.textEmerald}>Dashboard</Text></Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 5 }}>Manage your business on YatraSangi</Text>
      </View>

      <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: '#10b981', borderWidth: 1, borderRadius: 16, padding: 20, marginHorizontal: 20, marginBottom: 25, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 40, marginRight: 15 }}>🎁</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#34d399', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>3 Months Free Trial Active!</Text>
          <Text style={{ color: '#a7f3d0', fontSize: 13, lineHeight: 20 }}>Enjoy zero commission and unlimited access. Billing of ₹XYZ starts automatically after 90 days.</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {/* Real-time Ride Requests */}
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 10 }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Live Ride Requests</Text>
            <View style={{ backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: 'bold' }}>Searching...</Text>
            </View>
          </View>

          {incomingRides.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 30 }}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>📡</Text>
              <Text style={{ color: '#94a3b8', textAlign: 'center' }}>No new ride requests right now.</Text>
              <Text style={{ color: '#64748b', textAlign: 'center', fontSize: 12, marginTop: 5 }}>Keep this page open to receive live bookings.</Text>
            </View>
          ) : (
            <View style={{ gap: 15 }}>
              {incomingRides.map(ride => (
                <View key={ride.id} style={{ backgroundColor: '#020617', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.3)' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                      <Text style={{ color: '#eab308', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' }}>New Request</Text>
                    </View>
                    <Text style={{ color: '#64748b', fontSize: 12 }}>Just now</Text>
                  </View>
                  
                  <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 5 }}>🟢 {ride.pickup}</Text>
                  <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 15 }}>📍 {ride.drop}</Text>
                  
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity 
                      onPress={() => acceptRide(ride.id)}
                      style={{ flex: 1, backgroundColor: '#eab308', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                    >
                      <Text style={{ color: '#020617', fontWeight: 'bold' }}>Accept Ride</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => setIncomingRides(prev => prev.filter(r => r.id !== ride.id))}
                      style={{ flex: 1, backgroundColor: '#1e293b', paddingVertical: 10, borderRadius: 8, alignItems: 'center' }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Pricing Structure (After Trial)</Text>
        <View style={{ backgroundColor: 'rgba(30,41,59,0.5)', borderRadius: 16, padding: 15, marginBottom: 25 }}>
          {[
            { type: 'Hotels', rule: '1st Hotel: ₹XYZ | 2nd Hotel: ₹XYZ' },
            { type: 'Outstation Cabs', rule: '1st Car: ₹XYZ | 2nd Car: ₹XYZ' },
            { type: 'Local Rides (Bikes)', rule: '1st Bike: ₹XYZ | 2nd Bike: ₹XYZ' },
            { type: 'Tour Packages', rule: 'Flat ₹XYZ per package listing' },
            { type: 'Restaurants', rule: 'Base fee ₹XYZ + Optional Promos' },
          ].map((item, idx) => (
            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: idx === 4 ? 0 : 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
              <Text style={{ color: '#cbd5e1', fontWeight: 'bold' }}>{item.type}</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>{item.rule}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>My Listed Assets ({assets.length})</Text>
          <TouchableOpacity style={{ backgroundColor: '#6366f1', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>+ Add Asset</Text>
          </TouchableOpacity>
        </View>

        {assets.length === 0 ? (
          <View style={{ backgroundColor: 'rgba(2,6,23,0.5)', padding: 30, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
            <Text style={{ fontSize: 50, marginBottom: 15 }}>🏢</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>No Assets Listed Yet</Text>
            <Text style={{ color: '#94a3b8', textAlign: 'center', fontSize: 14 }}>Start adding your hotels, cabs, or bikes to get direct bookings from travelers!</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

// --- MAIN APP ---
const TravelerLoginScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (mobile.length >= 10 && name.trim() !== "" && city.trim() !== "" && stateName.trim() !== "") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert(`Mock SMS: Your YatraSangi OTP is 123456`);
        setStep(2);
      }, 1000);
    } else {
      alert("Please fill all details and enter a valid 10-digit mobile number");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length >= 4) {
      setLoading(true);
      setTimeout(() => {
        alert("Login Successful!");
        onLogin({ name, city, state: stateName, mobile });
      }, 1000);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80' }} 
      style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)' }} />
      
      <View style={{ width: '90%', maxWidth: 400, backgroundColor: '#0f172a', padding: 30, borderRadius: 24, borderWidth: 1, borderColor: '#1e293b', elevation: 10 }}>
        <View style={{ width: 80, height: 80, backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <Text style={{ fontSize: 40 }}>📱</Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: '900', color: 'white', textAlign: 'center', marginBottom: 5 }}>Welcome</Text>
        <Text style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 30 }}>Login securely with your mobile</Text>

        {step === 1 ? (
          <View style={{ gap: 20 }}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor="#475569"
                style={{ backgroundColor: '#020617', color: 'white', fontSize: 18, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' }}
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="City"
                  placeholderTextColor="#475569"
                  style={{ flex: 1, backgroundColor: '#020617', color: 'white', fontSize: 18, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' }}
                />
                <TextInput
                  value={stateName}
                  onChangeText={setStateName}
                  placeholder="State"
                  placeholderTextColor="#475569"
                  style={{ flex: 1, backgroundColor: '#020617', color: 'white', fontSize: 18, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' }}
                />
              </View>
              <View style={{ flexDirection: 'row', backgroundColor: '#020617', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden' }}>
                <View style={{ backgroundColor: '#0f172a', paddingHorizontal: 20, justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#1e293b' }}>
                  <Text style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: 18 }}>+91</Text>
                </View>
                <TextInput
                  value={mobile}
                  onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, '').slice(0, 10))}
                  keyboardType="phone-pad"
                  placeholder="Mobile Number"
                  placeholderTextColor="#475569"
                  style={{ flex: 1, color: 'white', fontSize: 20, fontWeight: 'bold', paddingVertical: 15, paddingHorizontal: 15, letterSpacing: 2 }}
                />
              </View>
            
            <TouchableOpacity onPress={handleSendOTP} disabled={loading || mobile.length < 10 || !name || !city || !stateName} style={{ backgroundColor: (mobile.length >= 10 && name && city && stateName) ? '#10b981' : '#334155', paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#10b981', shadowOpacity: 0.3, shadowRadius: 10 }}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Get OTP</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            <Text style={{ color: '#94a3b8', textAlign: 'center' }}>OTP sent to +91 {mobile}</Text>
            <TextInput
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 4))}
              keyboardType="number-pad"
              placeholder="••••"
              placeholderTextColor="#475569"
              style={{ backgroundColor: '#020617', color: 'white', fontSize: 32, fontWeight: 'bold', paddingVertical: 15, textAlign: 'center', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', letterSpacing: 15 }}
            />
            
            <TouchableOpacity onPress={handleVerifyOTP} disabled={loading || otp.length < 4} style={{ backgroundColor: otp.length >= 4 ? '#10b981' : '#334155', paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#10b981', shadowOpacity: 0.3, shadowRadius: 10 }}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Verify & Login</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep(1)} style={{ paddingVertical: 10, alignItems: 'center' }}>
              <Text style={{ color: '#94a3b8', fontSize: 16 }}>Change Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const PartnerLoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (mobile.length >= 10) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert(`Mock SMS: Your YatraSangi OTP is 123456`);
        setStep(2);
      }, 1000);
    } else {
      alert("Please enter a valid 10-digit mobile number");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length >= 4) {
      setLoading(true);
      setTimeout(() => {
        alert("Partner Login Successful!");
        onLogin();
      }, 1000);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80' }} 
      style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(2, 6, 23, 0.8)' }} />
      
      <View style={{ width: '90%', maxWidth: 400, backgroundColor: '#0f172a', padding: 30, borderRadius: 24, borderWidth: 1, borderColor: '#1e293b', elevation: 10 }}>
        <View style={{ width: 80, height: 80, backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: 40, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' }}>
          <Text style={{ fontSize: 40 }}>💼</Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: '900', color: 'white', textAlign: 'center', marginBottom: 5 }}>Partner Portal</Text>
        <Text style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 30 }}>Login to manage your business</Text>

        {step === 1 ? (
          <View style={{ gap: 20 }}>
            <View style={{ flexDirection: 'row', backgroundColor: '#020617', borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', overflow: 'hidden' }}>
              <View style={{ backgroundColor: '#0f172a', paddingHorizontal: 20, justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#1e293b' }}>
                <Text style={{ color: '#94a3b8', fontWeight: 'bold', fontSize: 18 }}>+91</Text>
              </View>
              <TextInput
                value={mobile}
                onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, '').slice(0, 10))}
                keyboardType="phone-pad"
                style={{ flex: 1, color: 'white', padding: 15, fontSize: 18, fontWeight: 'bold', letterSpacing: 2 }}
                placeholder="Mobile Number"
                placeholderTextColor="#64748b"
              />
            </View>
            <TouchableOpacity 
              onPress={handleSendOTP}
              disabled={loading || mobile.length < 10}
              style={{ backgroundColor: mobile.length >= 10 ? '#6366f1' : '#334155', padding: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#6366f1', shadowOpacity: 0.3, shadowRadius: 10 }}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Get OTP</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 20 }}>
            <Text style={{ color: '#94a3b8', textAlign: 'center' }}>OTP sent to +91 {mobile}</Text>
            <TextInput
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 4))}
              keyboardType="number-pad"
              style={{ backgroundColor: '#020617', color: 'white', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b', fontSize: 24, fontWeight: 'bold', textAlign: 'center', letterSpacing: 10 }}
              placeholder="••••"
              placeholderTextColor="#64748b"
            />
            <TouchableOpacity 
              onPress={handleVerifyOTP}
              disabled={loading || otp.length < 4}
              style={{ backgroundColor: otp.length >= 4 ? '#6366f1' : '#334155', padding: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#6366f1', shadowOpacity: 0.3, shadowRadius: 10 }}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Verify & Login</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep(1)} style={{ padding: 10, alignItems: 'center' }}>
              <Text style={{ color: '#6366f1', fontWeight: '600' }}>Change Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};


const TravelerDashboardScreen = ({ user, onPlanTrip }: { user: any, onPlanTrip: () => void }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, <Text style={styles.textEmerald}>{user?.name}</Text> 👋</Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 5 }}>Manage your trips and explore history.</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 25 }}>
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Profile Info</Text>
          <Text style={{ color: '#cbd5e1', marginBottom: 5 }}>Name: <Text style={{ color: 'white', fontWeight: 'bold' }}>{user?.name}</Text></Text>
          <Text style={{ color: '#cbd5e1', marginBottom: 5 }}>Mobile: <Text style={{ color: 'white', fontWeight: 'bold' }}>+91 {user?.mobile}</Text></Text>
          <Text style={{ color: '#cbd5e1', marginBottom: 5 }}>City: <Text style={{ color: 'white', fontWeight: 'bold' }}>{user?.city}</Text></Text>
          <Text style={{ color: '#cbd5e1' }}>State: <Text style={{ color: 'white', fontWeight: 'bold' }}>{user?.state}</Text></Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Your Trip History 🗺️</Text>
        
        <View style={{ backgroundColor: 'rgba(2,6,23,0.5)', padding: 30, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
          <Text style={{ fontSize: 50, marginBottom: 15 }}>🧳</Text>
          <Text style={{ color: '#e2e8f0', fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>No Trips Planned Yet</Text>
          <Text style={{ color: '#94a3b8', textAlign: 'center', fontSize: 14, marginBottom: 20 }}>Start planning your next adventure with our AI Trip Planner!</Text>
          <TouchableOpacity onPress={onPlanTrip} style={{ backgroundColor: '#10b981', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Plan a Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('Home');
  const [history, setHistory] = useState<string[]>([]);
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);
  const [loggedUser, setLoggedUser] = useState<any>(null);
  
  // Real Database state
  const [apiDestinations, setApiDestinations] = useState<Destination[]>([]);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  
  // Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('En');
  const [reviewText, setReviewText] = useState('');

  const submitReview = async () => {
    if (!reviewText.trim()) return;
    
    try {
      const apiUrl = isWeb ? 'http://localhost:3004' : 'http://192.168.1.111:3004';
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: reviewText,
          timestamp: new Date().toISOString(),
          source: "mobile"
        })
      });
      
      if (response.ok) {
        Alert.alert('Thank you!', 'Your review has been submitted.');
        setReviewText('');
      } else {
        Alert.alert('Error', 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.log('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please check your connection.');
    }
  };

  useEffect(() => {
    const apiUrl = isWeb ? 'http://localhost:3004' : 'http://192.168.1.111:3004';
    
    // Fetch live destinations from backend
    fetch(`${apiUrl}/destinations`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Map backend format to mobile format if needed
          const mapped = data.map((d: any) => ({
            id: d.id.toString(),
            name: d.name,
            state: d.state || 'Gujarat',
            image: d.image || 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80',
            rating: d.rating || 4.8,
            price: d.price || '₹10,000',
            type: d.type || 'Trending',
            description: d.description || 'Amazing destination'
          }));
          setApiDestinations(mapped);
        } else {
          setApiDestinations(DESTINATIONS_FALLBACK);
        }
      })
      .catch(err => {
        console.log('Destinations backend not reachable, using mock DESTINATIONS_FALLBACK');
        setApiDestinations(DESTINATIONS_FALLBACK);
      })
      .finally(() => setIsAppLoading(false));
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (selectedDestId) {
        setSelectedDestId(null);
        return true;
      }
      if (history.length > 0) {
        const newHistory = [...history];
        const prev = newHistory.pop();
        setHistory(newHistory);
        if (prev) setCurrentScreen(prev);
        return true;
      }
      if (currentScreen !== 'Home') {
        setCurrentScreen('Home');
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [currentScreen, selectedDestId, history]);

  const navigateTo = (screen: string) => {
    setHistory(prev => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (selectedDestId) {
      setSelectedDestId(null);
      return;
    }
    if (history.length > 0) {
      const newHistory = [...history];
      const prev = newHistory.pop();
      setHistory(newHistory);
      if (prev) setCurrentScreen(prev);
    } else {
      setCurrentScreen('Home');
    }
  };

  const navigateToDetail = (id: string) => setSelectedDestId(id);
  const handleBack = () => setSelectedDestId(null);

  if (isAppLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#34d399" />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
          <Image source={require('./assets/yatrasangi_logo.jpeg')} style={{ width: 30, height: 30, borderRadius: 8, marginRight: 10 }} />
          <Text style={{ color: '#34d399', fontSize: 18 }}>Starting YatraSangi...</Text>
        </View>
      </View>
    );
  }

  const displayName = loggedUser?.name || 'Traveler';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
      {/* Top Navbar with Menu Button */}
      {!selectedDestId && (
        <View style={[styles.topNavbar, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: isWeb ? 15 : 25, zIndex: 50 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {currentScreen !== 'Home' && (
              <TouchableOpacity onPress={navigateBack} style={{ padding: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>←</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => currentScreen !== 'Home' && navigateTo('Home')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('./assets/yatrasangi_logo.jpeg')} style={{ width: 30, height: 30, borderRadius: 8, marginRight: 10 }} />
              <Text style={{ color: '#818cf8', fontSize: 22, fontWeight: 'bold' }}>YatraSangi</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <TouchableOpacity onPress={() => setIsLangOpen(!isLangOpen)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.8)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: '#334155' }}>
              <Text style={{ color: 'white', marginRight: 5 }}>🌐</Text>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{currentLang}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={{ padding: 5 }}>
              <Text style={{ fontSize: 24, color: 'white' }}>☰</Text>
            </TouchableOpacity>
          </View>

          {isLangOpen && (
            <View style={{ position: 'absolute', top: isWeb ? 60 : 70, right: 60, backgroundColor: '#0f172a', borderRadius: 10, borderWidth: 1, borderColor: '#1e293b', elevation: 5, zIndex: 100, overflow: 'hidden', width: 120 }}>
              {['En', 'ગુજરાતી', 'हिन्दी'].map(lang => (
                <TouchableOpacity 
                  key={lang}
                  onPress={() => { setCurrentLang(lang); setIsLangOpen(false); }}
                  style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#1e293b', backgroundColor: currentLang === lang ? '#1e293b' : 'transparent' }}
                >
                  <Text style={{ color: currentLang === lang ? '#818cf8' : 'white', fontWeight: currentLang === lang ? 'bold' : 'normal' }}>{lang === 'En' ? 'English' : lang}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Side Menu Drawer (Modal) */}
      <Modal visible={isMenuOpen} transparent={true} animationType="fade">
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} activeOpacity={1} onPress={() => setIsMenuOpen(false)}>
          <View style={{ position: 'absolute', top: isWeb ? 60 : 70, left: 20, width: 280, backgroundColor: '#0f172a', borderRadius: 20, padding: 20, maxHeight: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 15, marginBottom: 15 }}>
              {loggedUser ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ width: 35, height: 35, backgroundColor: '#6366f1', borderRadius: 17.5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{displayName.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{displayName}</Text>
                    <Text style={{ color: '#34d399', fontSize: 10 }}>View Profile</Text>
                  </View>
                </View>
              ) : (
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Main Menu</Text>
              )}
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Text style={{ color: '#94a3b8', fontSize: 24 }}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ gap: 12 }}>
                {['Home', 'Destinations', 'Hotels', 'Cabs', 'Restaurants', 'Packages'].map((item) => (
                  <TouchableOpacity key={item} onPress={() => { navigateTo(item); setIsMenuOpen(false); }} style={{ paddingVertical: 5 }}>
                    <Text style={{ color: currentScreen === item ? '#c084fc' : 'white', fontSize: 16 }}>{item === 'Home' ? '🏠 ' : item === 'Destinations' ? '📍 ' : item === 'Hotels' ? '🏨 ' : item === 'Cabs' ? '🚕 ' : item === 'Restaurants' ? '🍽️ ' : item === 'Packages' ? '🌴 ' : ''}{item}</Text>
                  </TouchableOpacity>
                ))}
                
                <View style={{ height: 1, backgroundColor: '#1e293b', marginVertical: 5 }} />
                
                {/* App Settings */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 }}>
                  <Text style={{ fontSize: 16 }}>⚙️</Text>
                  <Text style={{ color: 'white', fontSize: 16 }}>App Settings</Text>
                </TouchableOpacity>

                {/* Highlighted Local Rides */}
                <TouchableOpacity 
                  onPress={() => { navigateTo('Local Rides'); setIsMenuOpen(false); }} 
                  style={{ marginTop: 10, backgroundColor: 'rgba(250, 204, 21, 0.1)', borderColor: 'rgba(250, 204, 21, 0.3)', borderWidth: 1, borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 16 }}>🛺 🛵 🚗</Text>
                    <Text style={{ color: '#facc15', fontSize: 16, fontWeight: 'bold' }}>Local Rides</Text>
                  </View>
                  <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ width: 6, height: 6, backgroundColor: '#ef4444', borderRadius: 3 }} />
                    <Text style={{ color: '#ef4444', fontSize: 10, fontWeight: 'bold' }}>LIVE</Text>
                  </View>
                </TouchableOpacity>

                {/* Partner Portal */}
                <TouchableOpacity onPress={() => { navigateTo('PartnerLogin'); setIsMenuOpen(false); }} style={{ marginTop: 10, backgroundColor: 'rgba(99, 102, 241, 0.9)', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 16 }}>💼</Text>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Partner Login</Text>
                </TouchableOpacity>
                
                {!loggedUser && (
                  <TouchableOpacity onPress={() => { navigateTo('Login'); setIsMenuOpen(false); }} style={{ marginTop: 10, backgroundColor: 'transparent', borderColor: '#3b82f6', borderWidth: 1, borderRadius: 12, padding: 10, alignItems: 'center' }}>
                    <Text style={{ color: '#60a5fa', fontSize: 16, fontWeight: 'bold' }}>Login / Join</Text>
                  </TouchableOpacity>
                )}

                {/* Customer Review Section */}
                <View style={{ backgroundColor: '#1e293b', padding: 15, borderRadius: 12, marginTop: 15 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8, fontSize: 12 }}>⭐ Write a Review</Text>
                  <TextInput 
                    value={reviewText}
                    onChangeText={setReviewText}
                    placeholder="How was your experience?"
                    placeholderTextColor="#64748b"
                    multiline
                    style={{ backgroundColor: '#020617', color: 'white', padding: 8, borderRadius: 8, height: 60, textAlignVertical: 'top', marginBottom: 8, fontSize: 12 }}
                  />
                  <TouchableOpacity onPress={submitReview} style={{ backgroundColor: '#6366f1', padding: 8, borderRadius: 8, alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Submit Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.screenContainer}>
        {selectedDestId ? (
          <DestinationDetailScreen destinationId={selectedDestId} onBack={handleBack} />
        ) : (
          <>
            {currentScreen === 'Home' && <HomeScreen destinations={apiDestinations} onNavigateToDetail={navigateToDetail} onStartAI={() => navigateTo('Trip Planner')} onNavigate={navigateTo} />}
            {currentScreen === 'Destinations' && <DestinationsScreen destinations={apiDestinations} onNavigateToDetail={navigateToDetail} />}
            {currentScreen === 'Trip Planner' && <AITripPlannerScreen onNavigate={navigateTo} />}
            {currentScreen === 'Hotels' && <HotelsScreen />}
            {currentScreen === 'Cabs' && <CabsScreen />}
            {currentScreen === 'Restaurants' && <RestaurantsScreen />}
            {currentScreen === 'Packages' && <PackagesScreen />}
            {currentScreen === 'Local Rides' && <LocalRidesScreen />}
            {currentScreen === 'PartnerDashboard' && <PartnerDashboardScreen />}
            {currentScreen === 'TravelerDashboard' && <TravelerDashboardScreen user={loggedUser} onPlanTrip={() => navigateTo('Trip Planner')} />}
            {currentScreen === 'Login' && <TravelerLoginScreen onLogin={(u) => { setLoggedUser(u); navigateTo('TravelerDashboard'); }} />}
            {currentScreen === 'PartnerLogin' && <PartnerLoginScreen onLogin={() => navigateTo('PartnerDashboard')} />}
            {!['Home', 'Destinations', 'Trip Planner', 'Hotels', 'Cabs', 'Restaurants', 'Packages', 'Local Rides', 'PartnerDashboard', 'TravelerDashboard', 'Login', 'PartnerLogin'].includes(currentScreen) && (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold' }}>{currentScreen}</Text>
                <Text style={{ color: '#94a3b8', marginTop: 10 }}>This section is being synced with the backend...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  screenContainer: { flex: 1 },
  topNavbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'rgba(2, 6, 23, 0.9)', zIndex: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  scrollContainer: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, marginTop: 40, marginBottom: 20 },
  title: { fontSize: 36, fontWeight: '900', color: '#ffffff', marginBottom: 8 },
  textEmerald: { color: '#34d399' },
  
  // Sections & Tabs
  section: { marginTop: 30, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 15 },
  horizontalScroll: { paddingBottom: 10 },
  tabsContainer: { marginBottom: 24 },
  tabsContent: { paddingHorizontal: 20, gap: 12 },
  tab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(15, 23, 42, 0.8)', borderWidth: 1, borderColor: '#334155', marginRight: 10 },
  activeTab: { backgroundColor: '#10b981', borderColor: '#10b981' },
  tabText: { color: '#cbd5e1', fontWeight: '600' },
  activeTabText: { color: '#ffffff' },

  // Cards
  cardsContainer: { paddingHorizontal: 20, gap: 20, flexDirection: isWeb ? 'row' : 'column', flexWrap: 'wrap' },
  card: { height: 300, width: isWeb ? 300 : '100%', borderRadius: 24, marginBottom: 20 },
  miniCard: { height: 200, width: 160, marginRight: 15, borderRadius: 16 },
  cardImage: { flex: 1, justifyContent: 'flex-end' },
  miniCardImage: { flex: 1, justifyContent: 'flex-end' },
  overlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: 24, padding: 20, justifyContent: 'space-between' },
  miniCardOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.3)', borderRadius: 16, padding: 15, justifyContent: 'flex-end' },
  tagContainer: { alignSelf: 'flex-end', backgroundColor: 'rgba(15, 23, 42, 0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  tagText: { color: '#34d399', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardContent: { marginTop: 'auto' },
  cardTitle: { color: '#ffffff', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  miniCardTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  cardSubtitle: { color: '#cbd5e1', fontSize: 14 }
});
