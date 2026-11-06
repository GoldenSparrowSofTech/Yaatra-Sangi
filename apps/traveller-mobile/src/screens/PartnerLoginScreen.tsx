import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground, Alert } from 'react-native';

interface PartnerLoginScreenProps {
  onLogin: () => void;
}

export const PartnerLoginScreen: React.FC<PartnerLoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = () => {
    if (mobile.length >= 10) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Mock SMS', 'Your YaatraSangi OTP is 123456');
        setStep(2);
      }, 1000);
    } else {
      Alert.alert('Notice', 'Please enter a valid 10-digit mobile number');
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length >= 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Partner Login Successful!');
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

