import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, StyleSheet } from 'react-native';

const isWeb = Platform.OS === 'web';

interface TopNavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onBack: () => void;
  onOpenMenu: () => void;
  currentLang: string;
  onChangeLang: (lang: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  onOpenMenu,
  currentLang,
  onChangeLang,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <View style={[styles.topNavbar, { paddingTop: isWeb ? 15 : 25 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {currentScreen !== 'Home' && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>←</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => currentScreen !== 'Home' && onNavigate('Home')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/yatrasangi_logo.png')} style={styles.logo} />
          <Text style={{ fontSize: 22, fontWeight: '900' }}>
            <Text style={{ color: '#0284c7' }}>Yaatra</Text>
            <Text style={{ color: '#f97316' }}>Sangi</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
        <TouchableOpacity
          onPress={() => setIsLangOpen(!isLangOpen)}
          style={styles.langPill}
        >
          <Text style={{ color: 'white', marginRight: 5 }}>🌐</Text>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{currentLang}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => currentScreen !== 'Home' && onNavigate('Home')} style={{ padding: 5 }}>
          <Text style={{ fontSize: 24, color: 'white' }}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onOpenMenu} style={{ padding: 5 }}>
          <Text style={{ fontSize: 24, color: 'white' }}>☰</Text>
        </TouchableOpacity>
      </View>

      {isLangOpen && (
        <View style={styles.langDropdown}>
          {['En', 'ગુજરાતી', 'हिन्दी'].map((lang) => (
            <TouchableOpacity
              key={lang}
              onPress={() => {
                onChangeLang(lang);
                setIsLangOpen(false);
              }}
              style={[styles.langItem, currentLang === lang && styles.langItemActive]}
            >
              <Text style={{ color: currentLang === lang ? '#818cf8' : 'white', fontWeight: currentLang === lang ? 'bold' : 'normal' }}>
                {lang === 'En' ? 'English' : lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(2, 6, 23, 0.95)',
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backBtn: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 8,
    marginRight: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  langDropdown: {
    position: 'absolute',
    top: isWeb ? 60 : 70,
    right: 60,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    elevation: 5,
    zIndex: 100,
    overflow: 'hidden',
    width: 120,
  },
  langItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  langItemActive: {
    backgroundColor: '#1e293b',
  },
});

