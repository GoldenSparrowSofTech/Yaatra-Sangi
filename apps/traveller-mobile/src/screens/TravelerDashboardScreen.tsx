import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface TravelerDashboardScreenProps {
  user: any;
  onPlanTrip: () => void;
}

export const TravelerDashboardScreen: React.FC<TravelerDashboardScreenProps> = ({ user, onPlanTrip }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, <Text style={styles.textEmerald}>{user?.name || 'Traveler'}</Text> 👋</Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 5 }}>Manage your trips and explore history.</Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 25 }}>
        <View style={{ backgroundColor: '#0f172a', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#1e293b' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Profile Info</Text>
          <Text style={{ color: '#cbd5e1', marginBottom: 5 }}>Name: <Text style={{ color: 'white', fontWeight: 'bold' }}>{user?.name || 'Traveler'}</Text></Text>
          <Text style={{ color: '#cbd5e1', marginBottom: 5 }}>Email: <Text style={{ color: 'white', fontWeight: 'bold' }}>{user?.email || 'N/A'}</Text></Text>
          <Text style={{ color: '#cbd5e1', marginBottom: 5 }}>Mobile: <Text style={{ color: 'white', fontWeight: 'bold' }}>+91 {user?.mobile || '9876543210'}</Text></Text>
          <Text style={{ color: '#cbd5e1', marginBottom: 5 }}>City: <Text style={{ color: 'white', fontWeight: 'bold' }}>{user?.city || 'Ahmedabad'}</Text></Text>
          <Text style={{ color: '#cbd5e1' }}>State: <Text style={{ color: 'white', fontWeight: 'bold' }}>{user?.state || 'Gujarat'}</Text></Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scrollContainer: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, marginTop: 40, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#ffffff', marginBottom: 8 },
  textEmerald: { color: '#34d399' },
});

