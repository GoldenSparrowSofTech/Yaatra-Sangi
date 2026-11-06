import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Platform,
} from 'react-native';
import { Destination, DestinationsScreenProps } from '../types/index.js';

const isWeb = Platform.OS === 'web';

export const DestinationsScreen: React.FC<DestinationsScreenProps> = ({
  destinations,
  onNavigateToDetail,
}) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const categories = ['All', 'Trending', 'Romantic', 'Adventure', 'Heritage'];

  const filtered =
    activeTab === 'All'
      ? destinations
      : destinations.filter((d: Destination) => d.type === activeTab);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Explore <Text style={styles.textEmerald}>Destinations</Text>
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveTab(cat)}
            style={[styles.tab, activeTab === cat && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === cat && styles.activeTabText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.cardsContainer}>
        {filtered.map((dest: Destination) => (
          <TouchableOpacity
            key={dest.id || dest.name}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => onNavigateToDetail(dest.id)}
          >
            <ImageBackground
              source={{ uri: dest.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80' }}
              style={styles.cardImage}
              imageStyle={{ borderRadius: 24 }}
            >
              <View style={styles.overlay}>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>{dest.type || 'Trending'}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{dest.name}</Text>
                  <Text style={styles.cardSubtitle}>
                    {dest.subtitle || dest.description || 'Amazing destination'}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', color: '#ffffff', marginBottom: 8 },
  textEmerald: { color: '#34d399' },
  tabsContainer: { marginBottom: 24 },
  tabsContent: { paddingHorizontal: 20, gap: 12 },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 10,
  },
  activeTab: { backgroundColor: '#10b981', borderColor: '#10b981' },
  tabText: { color: '#cbd5e1', fontWeight: '600' },
  activeTabText: { color: '#ffffff' },
  cardsContainer: {
    paddingHorizontal: 20,
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: { height: 280, width: isWeb ? 320 : '100%', borderRadius: 24, marginBottom: 20 },
  cardImage: { flex: 1, justifyContent: 'flex-end' },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'space-between',
  },
  tagContainer: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagText: { color: '#34d399', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardContent: { marginTop: 'auto' },
  cardTitle: { color: '#ffffff', fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { color: '#cbd5e1', fontSize: 14 },
});

