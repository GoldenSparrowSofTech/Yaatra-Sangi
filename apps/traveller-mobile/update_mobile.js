const fs = require('fs');

let code = fs.readFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', 'utf8');

// 1. Settings Screen
const settingsScreenCode = `
// --- SETTINGS SCREEN ---
const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 20, marginTop: 40 }}>Settings</Text>
      
      <View style={{ backgroundColor: '#1e293b', borderRadius: 15, padding: 15, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>🔔 Notifications</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>Receive alerts for rides & bookings</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#334155', true: '#facc15' }} thumbColor={'#ffffff'} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>📍 Location Services</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>Allow access to GPS for accurate rides</Text>
          </View>
          <Switch value={locationServices} onValueChange={setLocationServices} trackColor={{ false: '#334155', true: '#34d399' }} thumbColor={'#ffffff'} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>🌙 Dark Mode</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>Toggle application theme</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#334155', true: '#4f46e5' }} thumbColor={'#ffffff'} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>📶 Data Saver</Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>Reduce image quality to save data</Text>
          </View>
          <Switch value={dataSaver} onValueChange={setDataSaver} trackColor={{ false: '#334155', true: '#ef4444' }} thumbColor={'#ffffff'} />
        </View>
      </View>
    </View>
  );
};
`;

code = code.replace('// --- PARTNER DASHBOARD ---', settingsScreenCode + '\n// --- PARTNER DASHBOARD ---');

if (!code.includes('Switch,')) {
  code = code.replace('import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions, Platform, Alert, Animated } from \'react-native\';', 'import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions, Platform, Alert, Animated, Switch } from \'react-native\';');
}

// 2. Update PartnerDashboardScreen
code = code.replace('const [vendorId] = useState(\'driver-mobile-001\');\r\n\r\n  useEffect', 'const [vendorId] = useState(\'driver-mobile-001\');\n  const [isOnline, setIsOnline] = useState(false);\n  const [vehicleType, setVehicleType] = useState(\'bike\');\n\n  useEffect');

// Update driver_online
code = code.replace('newSocket.emit(\'driver_online\', { driverId: vendorId });', 'if(isOnline) { newSocket.emit(\'driver_online\', { driverId: vendorId, vehicleType }); }');

const toggleUI = `
      <View style={{ backgroundColor: '#1e293b', borderRadius: 15, padding: 20, marginBottom: 20, marginTop: 10 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Local Ride Captain Duty</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: isOnline ? '#34d399' : '#94a3b8', fontSize: 16, fontWeight: 'bold' }}>
              {isOnline ? '🟢 You are ONLINE' : '🔴 You are OFFLINE'}
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>Toggle to receive ride requests</Text>
          </View>
          <Switch 
            value={isOnline} 
            onValueChange={(val) => {
              setIsOnline(val);
              if (val && socket) {
                socket.emit('driver_online', { driverId: vendorId, vehicleType });
                Alert.alert('Online', 'You are now online and ready to accept rides!');
              } else {
                Alert.alert('Offline', 'You are now offline.');
              }
            }} 
            trackColor={{ false: '#334155', true: '#34d399' }} 
            thumbColor={'#ffffff'} 
          />
        </View>
      </View>
`;

code = code.replace('{activeTab === \'Overview\' && (\r\n        <ScrollView style={{ flex: 1, backgroundColor: \'#0f172a\' }}>', '{activeTab === \'Overview\' && (\r\n        <ScrollView style={{ flex: 1, backgroundColor: \'#0f172a\' }}>\n' + toggleUI);


// 3. Enable Settings in Navigation
code = code.replace('alert(\'Settings coming soon!\')', 'navigateTo(\'Settings\')');
code = code.replace('{currentScreen === \'PartnerDashboard\' && <PartnerDashboardScreen />}', '{currentScreen === \'PartnerDashboard\' && <PartnerDashboardScreen />}\n            {currentScreen === \'Settings\' && <SettingsScreen />}');

fs.writeFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', code);
console.log('App.tsx updated successfully');
