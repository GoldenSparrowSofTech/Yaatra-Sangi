import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { HomeScreenProps } from '../types/index.js';

const isWeb = Platform.OS === 'web';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  destinations,
  onNavigateToDetail,
  onStartAI,
  onNavigate,
}) => (
  <ImageBackground
    source={{ uri: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80' }}
    style={{ flex: 1, width: '100%' }}
  >
    <LinearGradient
      colors={['rgba(2, 6, 23, 0.6)', 'rgba(2, 6, 23, 0.9)']}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Floating Logo Top Left */}
        <View style={{ position: 'absolute', top: 10, left: 20, zIndex: 50 }}>
          <Image
            source={require('../../assets/yatrasangi_logo.png')}
            style={{ width: 80, height: 80, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }}
          />
        </View>

        {/* Hero Section */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 }}>
          <View
            style={{
              backgroundColor: 'rgba(99,102,241,0.15)',
              borderColor: 'rgba(99,102,241,0.3)',
              borderWidth: 1,
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 20,
              marginBottom: 30,
            }}
          >
            <Text style={{ color: '#a5b4fc', fontWeight: 'bold', fontSize: 12 }}>✨ Revolutionizing Travel in 2026</Text>
          </View>

          <Text style={{ fontSize: 48, fontWeight: '900', color: '#ffffff', textAlign: 'center', lineHeight: 55 }}>
            Experience{'\n'}
            <Text style={{ color: '#0284c7' }}>Yaatra</Text>
            <Text style={{ color: '#f97316' }}>Sangi</Text>
          </Text>

          <Text style={{ color: '#38bdf8', textAlign: 'center', fontSize: 16, marginTop: 8, fontStyle: 'italic', fontWeight: '600' }}>
            "Your Journey. Your Companion."
          </Text>

          <Text style={{ color: '#cbd5e1', textAlign: 'center', fontSize: 15, marginTop: 15, lineHeight: 22, paddingHorizontal: 10 }}>
            Zero commissions. Direct bookings. Intelligent AI routing.{'\n'}Your ultimate personalized travel companion.
          </Text>

          <TouchableOpacity
            onPress={onStartAI}
            style={{ width: '100%', marginTop: 30, shadowColor: '#4f46e5', shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 }}
          >
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
                  overflow: 'hidden',
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

        {/* Why YaatraSangi Section */}
        <View style={{ marginTop: 40, paddingHorizontal: 20, paddingBottom: 60, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 60, maxWidth: 1200, alignSelf: 'center', width: '100%' }}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 40, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: 10 }}>Why YaatraSangi?</Text>
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
                  <View style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)', width: 70, height: 70, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                    <Text style={{ fontSize: 32 }}>{feature.icon}</Text>
                  </View>
                  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>{feature.title}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 16, lineHeight: 24 }}>{feature.desc}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={{ backgroundColor: '#020617', paddingVertical: 50, paddingHorizontal: 30, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }}>
          <View style={{ flexDirection: isWeb ? 'row' : 'column', maxWidth: 1200, alignSelf: 'center', width: '100%', justifyContent: 'space-between', gap: 40 }}>
            <View style={{ flex: isWeb ? 1.5 : undefined }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Image source={require('../../assets/yatrasangi_logo.png')} style={{ width: 28, height: 28, borderRadius: 6, marginRight: 8 }} />
                <Text style={{ fontSize: 20, fontWeight: '900' }}>
                  <Text style={{ color: '#0284c7' }}>Yaatra</Text>
                  <Text style={{ color: '#f97316' }}>Sangi</Text>
                </Text>
              </View>
              <Text style={{ color: '#38bdf8', fontSize: 13, fontStyle: 'italic', marginBottom: 8, fontWeight: '600' }}>Your Journey. Your Companion.</Text>
              <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 22, paddingRight: 20 }}>Your ultimate companion for planning trips, booking stays, and finding reliable rides across India.</Text>
            </View>

            <View style={{ flex: isWeb ? 1 : undefined }}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Quick Links</Text>
              {[
                { name: 'Top Destinations', screen: 'Destinations' },
                { name: 'Trip Planner AI', screen: 'Trip Planner' },
                { name: 'Luxury Hotels', screen: 'Hotels' },
                { name: 'Book a Cab', screen: 'Cabs' },
                { name: 'Partner Login', screen: 'PartnerLogin' },
              ].map((link) => (
                <TouchableOpacity key={link.name} onPress={() => (link.name === 'Trip Planner AI' ? onStartAI() : onNavigate(link.screen))} style={{ marginBottom: 10 }}>
                  <Text style={{ color: '#94a3b8', fontSize: 14 }}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flex: isWeb ? 1 : undefined }}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>Contact & Support</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Customer Care:</Text>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>+91 93772 39439</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => Linking.openURL('tel:+919377239439')} style={{ backgroundColor: '#4f46e5', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12 }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('whatsapp://send?phone=919377239439')} style={{ backgroundColor: '#10b981', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12 }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', marginTop: 40, paddingTop: 20, flexDirection: isWeb ? 'row' : 'column', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, alignSelf: 'center', width: '100%' }}>
            <Text style={{ color: '#64748b', fontSize: 12 }}>© 2026 YaatraSangi. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  </ImageBackground>
);

