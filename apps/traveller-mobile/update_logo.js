const fs = require('fs');

let code = fs.readFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', 'utf8');

const target = '{/* Hero Section */}';
const replacement = `{/* Floating Logo Top Left (Below Header) */}
        <View style={{ position: 'absolute', top: 20, left: 20, zIndex: 50 }}>
          <Image 
            source={require('./assets/yatrasangi_logo.jpeg')} 
            style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' }} 
          />
        </View>

        {/* Hero Section */}`;

code = code.replace(target, replacement);

fs.writeFileSync('d:/Website/travelPartner/apps/traveller-mobile/App.tsx', code);
console.log('App.tsx updated for logo successfully');
