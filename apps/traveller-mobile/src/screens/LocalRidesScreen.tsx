import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config/api.js';

export const LocalRidesScreen = ({ user }: { user?: any }) => {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [step, setStep] = useState<'location' | 'select_vehicle' | 'searching' | 'accepted'>('location');
  const [selectedVehicle, setSelectedVehicle] = useState<'bike' | 'auto' | 'cab' | 'ambulance'>('bike');

  const [acceptedDriver, setAcceptedDriver] = useState<any | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(API_URL, {
      extraHeaders: { 'Bypass-Tunnel-Reminder': 'true' },
    });
    setSocket(newSocket);

    newSocket.on('ride_requested', (data) => {
      setBookingId(data.id);
      setTimeout(() => {
        newSocket.emit('accept_ride', { bookingId: data.id, driverId: 'partner@yatrasangi.com' });
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
            driverName: data.driverId || 'Mobile Captain',
            vehicleType: data.vehicleType || 'Auto',
            vehicleModel: 'Bajaj RE',
            vehicleNumber: 'GJ01-XX-9999',
            rating: 4.9,
            otp: data.otpPin || '5678',
            contactPhone: '+919876543210',
            image: 'https://images.unsplash.com/photo-1593081045266-9a5c898b671a?auto=format&fit=crop&q=80',
          });
          setStep('accepted');
        }
      };
      socket.on(`ride_status_updated_${bookingId}`, handleStatusUpdate);
      return () => {
        socket.off(`ride_status_updated_${bookingId}`, handleStatusUpdate);
      };
    }
  }, [socket, bookingId]);

  const handleBookRide = () => {
    if (socket) {
      setStep('searching');
      socket.emit('request_ride', {
        userId: user?.email || 'guest@yatrasangi.com',
        pickup,
        drop,
        vehicleType: selectedVehicle,
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#020617' }}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80' }}
        style={[{ flex: 1, width: '100%', height: '100%', position: 'absolute' }, step === 'searching' && { opacity: 0.5 }]}
      />

      <View style={{ flex: 1, justifyContent: 'space-between', padding: 20 }}>
        <View>
          <View style={{ backgroundColor: 'rgba(15,23,42,0.9)', padding: 15, borderRadius: 20, marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginRight: 10 }}>🛺</Text>
            <View>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>YaatraSangi Rides</Text>
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>0% Commission. Direct to Captain.</Text>
            </View>
          </View>

          {(step === 'location' || step === 'select_vehicle') && (
            <View style={{ backgroundColor: 'rgba(15,23,42,0.95)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' }}>
              <TextInput
                value={pickup}
                onChangeText={setPickup}
                placeholder="Pickup Location"
                placeholderTextColor="#64748b"
                style={{ backgroundColor: '#1e293b', color: 'white', padding: 14, borderRadius: 10, marginBottom: 10 }}
              />
              <TextInput
                value={drop}
                onChangeText={setDrop}
                placeholder="Drop Destination"
                placeholderTextColor="#64748b"
                style={{ backgroundColor: '#1e293b', color: 'white', padding: 14, borderRadius: 10 }}
              />
              {step === 'location' && (
                <TouchableOpacity
                  onPress={() => { if (pickup && drop) setStep('select_vehicle'); }}
                  style={{ backgroundColor: '#facc15', padding: 14, borderRadius: 10, marginTop: 15, alignItems: 'center' }}
                >
                  <Text style={{ color: 'black', fontWeight: 'bold' }}>Find Captains</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {step === 'searching' && (
            <View style={{ alignItems: 'center', marginTop: 100 }}>
              <ActivityIndicator size="large" color="#facc15" />
              <Text style={{ color: 'white', marginTop: 20, fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10 }}>
                Broadcasting to nearby Captains...
              </Text>
            </View>
          )}
        </View>

        {step === 'select_vehicle' && (
          <View style={{ backgroundColor: 'rgba(15,23,42,0.95)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 12 }}>Select Ride Type</Text>
            {[
              { type: 'bike', icon: '🏍️', name: 'Bike', price: '₹45', time: '1 min' },
              { type: 'auto', icon: '🛺', name: 'Auto', price: '₹80', time: '3 mins' },
              { type: 'cab', icon: '🚕', name: 'Mini Cab', price: '₹140', time: '5 mins' },
            ].map((v) => (
              <TouchableOpacity
                key={v.type}
                onPress={() => setSelectedVehicle(v.type as any)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: selectedVehicle === v.type ? 'rgba(250,204,21,0.1)' : '#1e293b',
                  borderWidth: 1,
                  borderColor: selectedVehicle === v.type ? '#facc15' : 'transparent',
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 24, marginRight: 15 }}>{v.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>{v.name}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 12 }}>{v.time} away</Text>
                </View>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{v.price}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={handleBookRide}
              style={{ backgroundColor: '#facc15', padding: 14, borderRadius: 10, marginTop: 5, alignItems: 'center' }}
            >
              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>
                Request {selectedVehicle.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'accepted' && acceptedDriver && (
          <View style={{ backgroundColor: 'rgba(15,23,42,0.95)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#334155' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <View>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Captain Arriving</Text>
                <Text style={{ color: '#34d399', fontWeight: 'bold' }}>Ride Accepted</Text>
              </View>
              <View style={{ backgroundColor: '#020617', padding: 8, borderRadius: 8 }}>
                <Text style={{ color: '#94a3b8', fontSize: 10 }}>OTP PIN</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, letterSpacing: 2 }}>{acceptedDriver.otp}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: 12, borderRadius: 12, marginBottom: 15 }}>
              <Image source={{ uri: acceptedDriver.image }} style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>{acceptedDriver.driverName}</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12 }}>{acceptedDriver.vehicleModel}</Text>
              </View>
              <Text style={{ fontWeight: 'bold', fontSize: 14, backgroundColor: '#facc15', paddingHorizontal: 8, borderRadius: 5, color: 'black' }}>
                {acceptedDriver.vehicleNumber}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${acceptedDriver.contactPhone}`)} style={{ flex: 1, backgroundColor: '#1e293b', padding: 12, borderRadius: 10, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>📞 Call</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${acceptedDriver.contactPhone}`)} style={{ flex: 1, backgroundColor: '#25D366', padding: 12, borderRadius: 10, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>💬 Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

