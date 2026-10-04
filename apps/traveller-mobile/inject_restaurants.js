const fs = require('fs');

let code = fs.readFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', 'utf8');

const restaurantsScreenCode = `
// --- RESTAURANTS SCREEN ---
const RestaurantsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const fallbackRestaurants = [
    { id: 1, slug: 'gordhan-thal', name: 'Gordhan Thal', location: 'Ahmedabad, Gujarat', rating: 4.8, avgCostForTwo: 1200, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', cuisineType: 'Authentic Gujarati Thali', vegOnly: true },
    { id: 2, slug: 'punjabi-nature', name: 'Punjabi Nature', location: 'Rajkot, Gujarat', rating: 4.6, avgCostForTwo: 900, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', cuisineType: 'North Indian', vegOnly: true },
    { id: 3, slug: 'the-dass-prakash', name: 'The Dass Prakash', location: 'Dwarka, Gujarat', rating: 4.9, avgCostForTwo: 600, image: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', cuisineType: 'South Indian', vegOnly: true },
    { id: 4, slug: 'kathiyawadi-dhaba', name: 'Kathiyawadi Dhaba', location: 'Somnath, Gujarat', rating: 4.7, avgCostForTwo: 500, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', cuisineType: 'Kathiyawadi', vegOnly: true },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80' }}
        style={{ width: '100%', height: 250, justifyContent: 'flex-end' }}
      >
        <LinearGradient colors={['transparent', '#0f172a']} style={{ height: 100, justifyContent: 'flex-end', padding: 20 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>Discover Restaurants</Text>
        </LinearGradient>
      </ImageBackground>

      <View style={{ padding: 20 }}>
        {/* Search */}
        <View style={{ flexDirection: 'row', backgroundColor: '#1e293b', borderRadius: 10, padding: 5, marginBottom: 20 }}>
          <TextInput 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
            placeholder="Search city or restaurant name..." 
            placeholderTextColor="#64748b"
            style={{ flex: 1, color: 'white', paddingHorizontal: 15 }} 
          />
          <TouchableOpacity onPress={() => Alert.alert('Search Applied', 'Results updated.')} style={{ backgroundColor: '#ea580c', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Find</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 15 }}>Top Rated Places</Text>
        
        {fallbackRestaurants.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase())).map((restaurant) => (
          <View key={restaurant.id} style={{ backgroundColor: '#1e293b', borderRadius: 15, overflow: 'hidden', marginBottom: 20 }}>
            <Image source={{ uri: restaurant.image }} style={{ width: '100%', height: 180 }} />
            
            {restaurant.vegOnly && (
              <View style={{ position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(22, 163, 74, 0.9)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 8, height: 8, backgroundColor: 'white', borderRadius: 4, marginRight: 5 }} />
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>Pure Veg</Text>
              </View>
            )}

            <View style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }} numberOfLines={1}>{restaurant.name}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 2 }}>{restaurant.location}</Text>
                </View>
                <View style={{ backgroundColor: '#0f172a', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#334155' }}>
                  <Text style={{ color: '#facc15', fontSize: 12, marginRight: 4 }}>★</Text>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{restaurant.rating}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', marginTop: 12, gap: 10 }}>
                <View style={{ backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 }}>
                  <Text style={{ color: '#cbd5e1', fontSize: 12 }}>{restaurant.cuisineType}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#334155' }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>₹{restaurant.avgCostForTwo}</Text>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>for two (approx)</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('View Details', 'Details page for ' + restaurant.name + ' will open.')} style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
                  <Text style={{ color: '#0f172a', fontWeight: 'bold' }}>View details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
`;

// Insert after CabsScreen
code = code.replace('// --- PACKAGES SCREEN ---', restaurantsScreenCode + '\\n\\n// --- PACKAGES SCREEN ---');

fs.writeFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', code);
console.log('RestaurantsScreen injected into App.tsx successfully');
