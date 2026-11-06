import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { API_BASE_URL } from '../config/api';

interface TravelerLoginScreenProps {
  onLogin: (user: { email: string; token: string; name?: string; mobile?: string; city?: string; state?: string }) => void;
}

export const TravelerLoginScreen: React.FC<TravelerLoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          alert('Login Successful!');
          onLogin({
            email,
            token: data.access_token || data.token,
            name: data.user?.name || email.split('@')[0],
            mobile: data.user?.phone || '9876543210',
            city: data.user?.city || 'Ahmedabad',
            state: data.user?.state || 'Gujarat',
          });
        } else {
          setError('Invalid email or password');
        }
      } catch (err) {
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill in both email and password');
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
          <Text style={{ fontSize: 40 }}>🔐</Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: '900', color: 'white', textAlign: 'center', marginBottom: 5 }}>Welcome Back</Text>
        <Text style={{ color: '#94a3b8', textAlign: 'center', marginBottom: 30 }}>Login securely with your account</Text>

        <View style={{ gap: 20 }}>
          {error ? <Text style={{ color: '#ef4444', textAlign: 'center', fontWeight: 'bold' }}>{error}</Text> : null}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            placeholderTextColor="#475569"
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ backgroundColor: '#020617', color: 'white', fontSize: 18, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#475569"
            secureTextEntry={true}
            style={{ backgroundColor: '#020617', color: 'white', fontSize: 18, paddingVertical: 15, paddingHorizontal: 15, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' }}
          />

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{ backgroundColor: '#10b981', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={{ color: '#475569', textAlign: 'center', marginTop: 20, fontSize: 12 }}>Use traveler@yatrasangi.com / password123</Text>
      </View>
    </ImageBackground>
  );
};

