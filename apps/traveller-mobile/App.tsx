import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, BackHandler, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Destination } from './src/types';
import { apiService } from './src/services/api.service';
import { TopNavbar } from './src/components/TopNavbar';
import { SideDrawer } from './src/components/SideDrawer';

import { HomeScreen } from './src/screens/HomeScreen';
import { DestinationsScreen } from './src/screens/DestinationsScreen';
import { DestinationDetailScreen } from './src/screens/DestinationDetailScreen';
import { AITripPlannerScreen } from './src/screens/AITripPlannerScreen';
import { HotelsScreen } from './src/screens/HotelsScreen';
import { CabsScreen } from './src/screens/CabsScreen';
import { LocalRidesScreen } from './src/screens/LocalRidesScreen';
import { RestaurantsScreen } from './src/screens/RestaurantsScreen';
import { PackagesScreen } from './src/screens/PackagesScreen';
import { TravelerLoginScreen } from './src/screens/TravelerLoginScreen';
import { PartnerLoginScreen } from './src/screens/PartnerLoginScreen';
import { TravelerDashboardScreen } from './src/screens/TravelerDashboardScreen';
import { PartnerDashboardScreen } from './src/screens/PartnerDashboardScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const DESTINATIONS_FALLBACK: Destination[] = [
  { id: '1', name: 'Rajkot', state: 'Gujarat', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80', rating: 4.5, type: 'Trending', description: 'Cultural hub of Saurashtra with amazing food and heritage.' },
  { id: '2', name: 'Dwarka', state: 'Gujarat', image: 'https://images.unsplash.com/photo-1629813358055-6677e81b66b8?q=80', rating: 4.9, type: 'Heritage', description: 'Ancient sacred city of Lord Krishna.' },
  { id: '3', name: 'Goa', state: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80', rating: 4.8, type: 'Romantic', description: 'Famous for its beautiful beaches, nightlife, and Portuguese heritage.' },
  { id: '4', name: 'Rajasthan', state: 'Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80', rating: 4.9, type: 'Heritage', description: 'The land of kings, famous for massive forts and royal palaces.' },
  { id: '5', name: 'Kerala', state: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80', rating: 4.9, type: 'Romantic', description: 'Gods Own Country, famous for its backwaters and lush green landscapes.' },
  { id: '6', name: 'Agra', state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1564507592227-cb84b196a8ee?q=80', rating: 4.7, type: 'Heritage', description: 'Home to the iconic Taj Mahal, a symbol of eternal love.' },
  { id: '7', name: 'Manali', state: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80', rating: 4.8, type: 'Adventure', description: 'A high-altitude Himalayan resort town known for backpacking.' },
  { id: '8', name: 'Andaman', state: 'Andaman', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80', rating: 4.9, type: 'Trending', description: 'Pristine beaches, crystal clear waters, and world-class scuba diving.' }
];

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<string>('Home');
  const [history, setHistory] = useState<string[]>([]);
  const [searchContext, setSearchContext] = useState<string>('');
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);
  const [loggedUser, setLoggedUser] = useState<any>(null);

  // Settings State
  const [notifications, setNotifications] = useState(false);
  const [locationServices, setLocationServices] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  // Data state
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Navigation & Drawer
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('En');

  useEffect(() => {
    apiService.getDestinations()
      .then((data: Destination[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        } else {
          setDestinations(DESTINATIONS_FALLBACK);
        }
      })
      .catch(() => setDestinations(DESTINATIONS_FALLBACK))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (selectedDestId) {
        setSelectedDestId(null);
        return true;
      }
      if (history.length > 0) {
        const newHistory = [...history];
        const prev = newHistory.pop();
        setHistory(newHistory);
        if (prev) setCurrentScreen(prev);
        return true;
      }
      if (currentScreen !== 'Home') {
        setCurrentScreen('Home');
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [currentScreen, selectedDestId, history]);

  const navigateTo = (screen: string, context: string = '') => {
    setSearchContext(context);
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (selectedDestId) {
      setSelectedDestId(null);
      return;
    }
    if (history.length > 0) {
      const newHistory = [...history];
      const prev = newHistory.pop();
      setHistory(newHistory);
      if (prev) setCurrentScreen(prev);
    } else {
      setCurrentScreen('Home');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34d399" />
        <View style={styles.loadingLogoRow}>
          <Image source={require('./assets/yatrasangi_logo.png')} style={styles.loadingLogo} />
          <Text style={styles.loadingText}>Starting YaatraSangi...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {!selectedDestId && (
        <TopNavbar
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onBack={navigateBack}
          onOpenMenu={() => setIsMenuOpen(true)}
          currentLang={currentLang}
          onChangeLang={setCurrentLang}
        />
      )}

      <SideDrawer
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        loggedUser={loggedUser}
        currentLang={currentLang}
      />

      <View style={styles.screenContainer}>
        {selectedDestId ? (
          <DestinationDetailScreen destinationId={selectedDestId} onBack={() => setSelectedDestId(null)} />
        ) : (
          <>
            {currentScreen === 'Home' && (
              <HomeScreen
                destinations={destinations}
                onNavigateToDetail={setSelectedDestId}
                onStartAI={() => navigateTo('Trip Planner')}
                onNavigate={navigateTo}
              />
            )}
            {currentScreen === 'Destinations' && (
              <DestinationsScreen
                destinations={destinations}
                onNavigateToDetail={setSelectedDestId}
              />
            )}
            {currentScreen === 'Trip Planner' && <AITripPlannerScreen onNavigate={navigateTo} />}
            {currentScreen === 'Hotels' && <HotelsScreen initialSearch={searchContext} />}
            {currentScreen === 'Cabs' && <CabsScreen initialSearch={searchContext} />}
            {currentScreen === 'Restaurants' && <RestaurantsScreen />}
            {currentScreen === 'Packages' && <PackagesScreen />}
            {currentScreen === 'Local Rides' && <LocalRidesScreen user={loggedUser} />}
            {currentScreen === 'PartnerDashboard' && <PartnerDashboardScreen />}
            {currentScreen === 'Settings' && (
              <SettingsScreen
                notifications={notifications}
                setNotifications={setNotifications}
                locationServices={locationServices}
                setLocationServices={setLocationServices}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                dataSaver={dataSaver}
                setDataSaver={setDataSaver}
              />
            )}
            {currentScreen === 'TravelerDashboard' && (
              <TravelerDashboardScreen user={loggedUser} onPlanTrip={() => navigateTo('Trip Planner')} />
            )}
            {currentScreen === 'Login' && (
              <TravelerLoginScreen
                onLogin={(u) => {
                  setLoggedUser(u);
                  navigateTo('TravelerDashboard');
                }}
              />
            )}
            {currentScreen === 'PartnerLogin' && (
              <PartnerLoginScreen onLogin={() => navigateTo('PartnerDashboard')} />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  screenContainer: { flex: 1 },
  loadingContainer: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  loadingLogoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  loadingLogo: { width: 30, height: 30, borderRadius: 8, marginRight: 10 },
  loadingText: { color: '#34d399', fontSize: 18 },
});
