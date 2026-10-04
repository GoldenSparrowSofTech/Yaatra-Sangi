const fs = require('fs');

let code = fs.readFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', 'utf8');

const cabsScreenCode = `
// --- CABS SCREEN (Outstation Cabs) ---
const CabsScreen = ({ initialSearch = '' }: { initialSearch?: string }) => {
  const [pickup, setPickup] = useState(initialSearch);
  const [dropoff, setDropoff] = useState('');
  
  const fallbackTaxis = [
    { id: '1', slug: 'royal-cabs', name: 'Royal Cabs', type: 'SUV (Innova)', location: 'Delhi NCR', rating: 4.8, price: 15, perKm: true, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80', capacity: 6, bags: 4 },
    { id: '2', slug: 'shiv-taxi', name: 'Shiv Taxi Service', type: 'Sedan (Dzire)', location: 'Mumbai', rating: 4.6, price: 12, perKm: true, image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80', capacity: 4, bags: 2 },
  ];

  const handleBookCab = () => {
    Alert.alert('Booking Confirmed', 'Your Outstation Cab has been successfully booked! Our driver will contact you shortly.');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80' }}
        style={{ width: '100%', height: 250, justifyContent: 'flex-end' }}
      >
        <LinearGradient colors={['transparent', '#0f172a']} style={{ height: 100, justifyContent: 'flex-end', padding: 20 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>Outstation Cabs</Text>
        </LinearGradient>
      </ImageBackground>

      <View style={{ padding: 20 }}>
        {/* Search Form */}
        <View style={{ backgroundColor: '#1e293b', padding: 15, borderRadius: 15, marginBottom: 25 }}>
          <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>PICKUP LOCATION</Text>
          <TextInput 
            value={pickup} 
            onChangeText={setPickup} 
            placeholder="e.g. City, Airport" 
            placeholderTextColor="#475569"
            style={{ backgroundColor: '#0f172a', color: 'white', padding: 15, borderRadius: 10, marginBottom: 15 }} 
          />

          <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>DROP-OFF LOCATION</Text>
          <TextInput 
            value={dropoff} 
            onChangeText={setDropoff} 
            placeholder="e.g. Destination City" 
            placeholderTextColor="#475569"
            style={{ backgroundColor: '#0f172a', color: 'white', padding: 15, borderRadius: 10, marginBottom: 15 }} 
          />

          <TouchableOpacity style={{ backgroundColor: '#4f46e5', padding: 15, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Find Cabs</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 15 }}>Available Vehicles</Text>
        
        {fallbackTaxis.map((taxi) => (
          <View key={taxi.id} style={{ backgroundColor: '#1e293b', borderRadius: 15, overflow: 'hidden', marginBottom: 20 }}>
            <Image source={{ uri: taxi.image }} style={{ width: '100%', height: 180 }} />
            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white' }}>{taxi.type}</Text>
                  <Text style={{ color: '#94a3b8' }}>{taxi.name}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#10b981' }}>₹{taxi.price}/km</Text>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>Est. Rate</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 15, gap: 15 }}>
                <Text style={{ color: '#cbd5e1' }}>👥 {taxi.capacity} Seats</Text>
                <Text style={{ color: '#cbd5e1' }}>🧳 {taxi.bags} Bags</Text>
              </View>

              <TouchableOpacity onPress={handleBookCab} style={{ backgroundColor: '#10b981', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Book Vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
`;

// Insert after HotelsScreen
code = code.replace('// --- HOTELS SCREEN ---', cabsScreenCode + '\\n\\n// --- HOTELS SCREEN ---');

fs.writeFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', code);
console.log('CabsScreen injected into App.tsx successfully');
