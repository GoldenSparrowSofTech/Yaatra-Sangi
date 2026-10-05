export const translations = {
  'En': {
    selectLanguage: 'Select Language',
    english: 'English',
    home: 'Home',
    destinations: 'Destinations',
    tripPlanner: 'AI Trip Planner',
    hotels: 'Hotels',
    cabs: 'Outstation Cabs',
    localRides: 'Local Rides',
    restaurants: 'Restaurants',
    packages: 'Tour Packages',
    settings: 'App Settings'
  },
  'ગુજરાતી': {
    selectLanguage: 'ભાષા પસંદ કરો',
    english: 'અંગ્રેજી',
    home: 'હોમ',
    destinations: 'સ્થળો',
    tripPlanner: 'AI ટ્રિપ પ્લાનર',
    hotels: 'હોટેલ્સ',
    cabs: 'આઉટસ્ટેશન કેબ્સ',
    localRides: 'લોકલ રાઇડ્સ',
    restaurants: 'રેસ્ટોરન્ટ્સ',
    packages: 'ટૂર પેકેજીસ',
    settings: 'એપ સેટિંગ્સ'
  },
  'हिन्दी': {
    selectLanguage: 'भाषा चुनें',
    english: 'अंग्रेज़ी',
    home: 'होम',
    destinations: 'गंतव्य',
    tripPlanner: 'AI ट्रिप प्लानर',
    hotels: 'होटल',
    cabs: 'आउटस्टेशन कैब्स',
    localRides: 'लोकल राइड्स',
    restaurants: 'रेस्टोरेंट्स',
    packages: 'टूर पैकेज',
    settings: 'ऐप सेटिंग्स'
  }
};

export const t = (key: string, currentLang: string) => {
  const langTranslations = translations[currentLang as keyof typeof translations] || translations['En'];
  return (langTranslations as any)[key] || key;
};
