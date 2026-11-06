import React from 'react';
import { View, Text, Switch, Alert, StyleSheet } from 'react-native';

interface SettingsScreenProps {
  notifications: boolean;
  setNotifications: (v: boolean) => void;
  locationServices: boolean;
  setLocationServices: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  dataSaver: boolean;
  setDataSaver: (v: boolean) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  notifications,
  setNotifications,
  locationServices,
  setLocationServices,
  darkMode,
  setDarkMode,
  dataSaver,
  setDataSaver,
}) => {
  const handleLocation = (val: boolean) => {
    setLocationServices(val);
    if (val) {
      Alert.alert('Location Services', 'GPS access has been enabled. Your location will be used to find nearby rides.');
    }
  };

  const handleNotifications = (val: boolean) => {
    setNotifications(val);
    if (val) {
      Alert.alert('Notifications Enabled', 'You will now receive push notifications for ride updates and bookings.');
    }
  };

  const handleDarkMode = (val: boolean) => {
    setDarkMode(val);
    if (!val) {
      Alert.alert('Light Mode Activated', 'Light mode enabled globally.');
    }
  };

  const handleDataSaver = (val: boolean) => {
    setDataSaver(val);
    if (val) {
      Alert.alert('Data Saver On', 'Background syncing reduced to save data.');
    }
  };

  const bgColor = darkMode ? '#0f172a' : '#f1f5f9';
  const cardColor = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? 'white' : '#0f172a';
  const subTextColor = darkMode ? '#94a3b8' : '#64748b';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: cardColor }]}>
        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.settingLabel, { color: textColor }]}>🔔 Notifications</Text>
            <Text style={[styles.settingSubLabel, { color: subTextColor }]}>Receive alerts for rides & bookings</Text>
          </View>
          <Switch value={notifications} onValueChange={handleNotifications} trackColor={{ false: '#cbd5e1', true: '#facc15' }} thumbColor={'#ffffff'} />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.settingLabel, { color: textColor }]}>📍 Location Services</Text>
            <Text style={[styles.settingSubLabel, { color: subTextColor }]}>Allow access to GPS for accurate rides</Text>
          </View>
          <Switch value={locationServices} onValueChange={handleLocation} trackColor={{ false: '#cbd5e1', true: '#34d399' }} thumbColor={'#ffffff'} />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={[styles.settingLabel, { color: textColor }]}>🌙 Dark Mode</Text>
            <Text style={[styles.settingSubLabel, { color: subTextColor }]}>Toggle application theme</Text>
          </View>
          <Switch value={darkMode} onValueChange={handleDarkMode} trackColor={{ false: '#cbd5e1', true: '#4f46e5' }} thumbColor={'#ffffff'} />
        </View>

        <View style={[styles.settingRow, { marginBottom: 0 }]}>
          <View>
            <Text style={[styles.settingLabel, { color: textColor }]}>📶 Data Saver</Text>
            <Text style={[styles.settingSubLabel, { color: subTextColor }]}>Reduce image quality to save data</Text>
          </View>
          <Switch value={dataSaver} onValueChange={handleDataSaver} trackColor={{ false: '#cbd5e1', true: '#ef4444' }} thumbColor={'#ffffff'} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
  card: { borderRadius: 15, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  settingLabel: { fontSize: 16, fontWeight: 'bold' },
  settingSubLabel: { fontSize: 12, marginTop: 2 },
});

