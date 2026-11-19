import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (isWeb ? 'http://localhost:3001' : 'http://10.0.2.2:3001');

export const API_BASE_URL = API_URL;

// Global fetch wrapper with tunnel bypass header
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  const customOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Bypass-Tunnel-Reminder': 'true',
      ...(options.headers || {}),
    },
  };
  return fetch(url, customOptions);
};

