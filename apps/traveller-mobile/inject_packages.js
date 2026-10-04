const fs = require('fs');

let code = fs.readFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', 'utf8');

const packagesScreenCode = `
// --- PACKAGES SCREEN ---
const PackagesScreen = () => {
  const fallbackPackages = [
    { id: 1, slug: 'goa-4-days', title: "Goa Weekend Getaway", duration: "4 Days / 3 Nights", price: 12500, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80", rating: 4.8, reviews: 124, features: ["Hotel Included", "Sightseeing", "Breakfast"], vendorName: "Goa Beach Travels" },
    { id: 2, slug: 'manali-trip', title: "Manali Snow Adventure", duration: "6 Days / 5 Nights", price: 18900, image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&q=80", rating: 4.9, reviews: 89, features: ["3 Star Hotel", "Snow Activities", "Meals"], vendorName: "Himalayan Trekkers" },
    { id: 3, slug: 'kerala-tour', title: "Kerala Backwaters", duration: "5 Days / 4 Nights", price: 16500, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80", rating: 4.7, reviews: 210, features: ["Houseboat", "Munnar", "Ayurvedic Spa"], vendorName: "God's Own Holidays" }
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80' }}
        style={{ width: '100%', height: 250, justifyContent: 'flex-end' }}
      >
        <LinearGradient colors={['transparent', '#0f172a']} style={{ height: 100, justifyContent: 'flex-end', padding: 20 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white' }}>Tour Packages</Text>
        </LinearGradient>
      </ImageBackground>

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#94a3b8', marginBottom: 20 }}>Exclusive deals directly from local travel agents. 0% Commission.</Text>
        
        {fallbackPackages.map((pkg) => (
          <View key={pkg.id} style={{ backgroundColor: '#1e293b', borderRadius: 15, overflow: 'hidden', marginBottom: 25 }}>
            <Image source={{ uri: pkg.image }} style={{ width: '100%', height: 200 }} />
            
            <View style={{ position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(2, 6, 23, 0.8)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{pkg.duration}</Text>
            </View>

            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 5 }}>{pkg.title}</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Text style={{ color: '#facc15', fontSize: 14, marginRight: 5 }}>★</Text>
                <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 5 }}>{pkg.rating}</Text>
                <Text style={{ color: '#64748b', fontSize: 12 }}>({pkg.reviews} reviews)</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
                {pkg.features.map((feat, idx) => (
                  <View key={idx} style={{ backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                    <Text style={{ color: '#cbd5e1', fontSize: 11 }}>{feat}</Text>
                  </View>
                ))}
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#334155' }}>
                <View>
                  <Text style={{ color: '#64748b', fontSize: 12 }}>Starting from</Text>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>₹{pkg.price}</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Request Sent!', 'Your booking request for ' + pkg.title + ' has been sent to ' + pkg.vendorName + '. They will contact you shortly.')} style={{ backgroundColor: '#10b981', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Book Now</Text>
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

code = code.replace('// --- LOCAL RIDES SCREEN ---', packagesScreenCode + '\\n\\n// --- LOCAL RIDES SCREEN ---');

fs.writeFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', code);
console.log('PackagesScreen injected successfully');
