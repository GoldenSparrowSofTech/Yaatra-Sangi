import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config/api';

export const PartnerDashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [assets, setAssets] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [incomingRides, setIncomingRides] = useState<any[]>([]);
  const [vendorId] = useState('driver-mobile-001');
  const [isOnline, setIsOnline] = useState(false);
  const [vehicleType, setVehicleType] = useState('bike');

  useEffect(() => {
    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Mobile Partner connected to WebSocket');
      if (isOnline) {
        newSocket.emit('driver_online', { driverId: vendorId, vehicleType });
      }
    });

    newSocket.on('new_ride_request', (ride) => {
      console.log('New ride received in mobile app:', ride);
      setIncomingRides((prev) => [...prev, ride]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [vendorId, isOnline, vehicleType]);

  const acceptRide = (bookingId: string) => {
    if (socket) {
      socket.emit('accept_ride', { bookingId, driverId: vendorId });

      socket.once('ride_accepted_success', () => {
        Alert.alert('Success', 'You successfully accepted the ride!');
        setIncomingRides((prev) => prev.filter((r) => r.id !== bookingId));
      });
      socket.once('ride_accepted_failed', (data: any) => {
        Alert.alert('Failed', 'Failed to accept: ' + data.message);
        setIncomingRides((prev) => prev.filter((r) => r.id !== bookingId));
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Partner <Text style={styles.textEmerald}>Dashboard</Text></Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 5 }}>Manage your business on YaatraSangi</Text>
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
              {incomingRides.map((ride) => (
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
                      onPress={() => setIncomingRides((prev) => prev.filter((r) => r.id !== ride.id))}
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
          <TouchableOpacity onPress={() => Alert.alert('Add Asset', 'This feature is coming soon!')} style={{ backgroundColor: '#6366f1', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 }}>
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

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, marginTop: 40, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#ffffff', marginBottom: 8 },
  textEmerald: { color: '#34d399' },
});

