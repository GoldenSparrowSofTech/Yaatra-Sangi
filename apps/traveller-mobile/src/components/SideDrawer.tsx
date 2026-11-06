import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Platform, StyleSheet } from 'react-native';
import { t } from '../../translations';
import { API_BASE_URL } from '../config/api';

const isWeb = Platform.OS === 'web';

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentScreen: string;
  onNavigate: (route: string) => void;
  loggedUser: any;
  currentLang: string;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  visible,
  onClose,
  currentScreen,
  onNavigate,
  loggedUser,
  currentLang,
}) => {
  const [reviewText, setReviewText] = useState('');
  const displayName = loggedUser?.name || 'Traveler';

  const submitReview = async () => {
    if (!reviewText.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reviewText,
          timestamp: new Date().toISOString(),
          source: 'mobile',
        }),
      });

      if (response.ok) {
        Alert.alert('Thank you!', 'Your review has been submitted.');
        setReviewText('');
      } else {
        Alert.alert('Error', 'Failed to submit review. Please try again.');
      }
    } catch {
      Alert.alert('Error', 'Failed to submit review. Please check your connection.');
    }
  };

  const navItems = [
    { name: 'Home', tKey: 'home', icon: '🏠', route: 'Home' },
    { name: 'Destinations', tKey: 'destinations', icon: '📍', route: 'Destinations' },
    { name: 'AI Trip Planner', tKey: 'tripPlanner', icon: '🤖', route: 'Trip Planner' },
    { name: 'Hotels', tKey: 'hotels', icon: '🏨', route: 'Hotels' },
    { name: 'Outstation Cabs', tKey: 'cabs', icon: '🚕', route: 'Cabs' },
    { name: 'Local Rides', tKey: 'localRides', icon: '🛵', route: 'Local Rides' },
    { name: 'Restaurants', tKey: 'restaurants', icon: '🍽️', route: 'Restaurants' },
    { name: 'Tour Packages', tKey: 'packages', icon: '🌴', route: 'Packages' },
  ];

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.drawerContent, { paddingTop: isWeb ? 20 : 50 }]}
        >
          <View style={styles.header}>
            {loggedUser ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.avatar}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{displayName}</Text>
                  <Text style={{ color: '#34d399', fontSize: 10 }}>View Profile</Text>
                </View>
              </View>
            ) : (
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Main Menu</Text>
            )}
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: '#94a3b8', fontSize: 24 }}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ gap: 4 }}>
              {navItems.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => {
                    onNavigate(item.route);
                    onClose();
                  }}
                  style={[
                    styles.navItem,
                    currentScreen === item.route && styles.navItemActive,
                  ]}
                >
                  <Text style={{ fontSize: 22, marginRight: 15 }}>{item.icon}</Text>
                  <Text
                    style={{
                      color: currentScreen === item.route ? 'white' : '#cbd5e1',
                      fontSize: 16,
                      fontWeight: currentScreen === item.route ? 'bold' : 'normal',
                    }}
                  >
                    {t(item.tKey, currentLang)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Partner Portal & Settings */}
            <View style={styles.partnerSection}>
              <TouchableOpacity
                onPress={() => {
                  onNavigate('PartnerLogin');
                  onClose();
                }}
                style={[
                  styles.navItem,
                  currentScreen === 'PartnerLogin' && styles.navItemActive,
                ]}
              >
                <Text style={{ fontSize: 22, marginRight: 15 }}>💼</Text>
                <Text style={{ color: '#6366f1', fontSize: 16, fontWeight: 'bold' }}>Partner Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onClose();
                  onNavigate('Settings');
                }}
                style={styles.navItem}
              >
                <Text style={{ fontSize: 22, marginRight: 15 }}>⚙️</Text>
                <Text style={{ color: '#cbd5e1', fontSize: 16 }}>App Settings</Text>
              </TouchableOpacity>

              {!loggedUser && (
                <TouchableOpacity
                  onPress={() => {
                    onNavigate('Login');
                    onClose();
                  }}
                  style={styles.navItem}
                >
                  <Text style={{ fontSize: 22, marginRight: 15 }}>👤</Text>
                  <Text style={{ color: '#60a5fa', fontSize: 16, fontWeight: 'bold' }}>Login / Join</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Review Box */}
            <View style={styles.reviewBox}>
              <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8, fontSize: 12 }}>⭐ Write a Review</Text>
              <TextInput
                value={reviewText}
                onChangeText={setReviewText}
                placeholder="How was your experience?"
                placeholderTextColor="#64748b"
                multiline
                style={styles.reviewInput}
              />
              <TouchableOpacity onPress={submitReview} style={styles.reviewBtn}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>Submit Review</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  drawerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#0f172a',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 15,
    marginBottom: 15,
  },
  avatar: {
    width: 35,
    height: 35,
    backgroundColor: '#6366f1',
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#1e293b',
  },
  partnerSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 20,
  },
  reviewBox: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  reviewInput: {
    backgroundColor: '#020617',
    color: 'white',
    padding: 8,
    borderRadius: 8,
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 8,
    fontSize: 12,
  },
  reviewBtn: {
    backgroundColor: '#6366f1',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
});

