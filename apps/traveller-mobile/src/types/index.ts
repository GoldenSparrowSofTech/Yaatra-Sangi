export interface Place {
  name: string;
  description: string;
  image: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: string | number;
  image: string;
  rating: string | number;
  distanceKm?: number;
}

export interface Destination {
  id: string;
  name: string;
  state?: string;
  country?: string;
  rating?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  type?: string;
  latitude?: number;
  longitude?: number;
  placesToVisit?: Place[];
  hotels?: Hotel[];
}

export interface Taxi {
  id: number;
  slug: string;
  name: string;
  type: string;
  model: string;
  location: string;
  capacity: string;
  bags: string;
  rating: number;
  price: number;
  perKm: boolean;
  image: string;
  features: string[];
  recommended?: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  access_token?: string;
}

export interface HomeScreenProps {
  destinations: Destination[];
  onNavigateToDetail: (id: string) => void;
  onStartAI: () => void;
  onNavigate: (screen: string, context?: string) => void;
}

export interface DestinationsScreenProps {
  destinations: Destination[];
  onNavigateToDetail: (id: string) => void;
}

export interface DestinationDetailProps {
  destinationId: string;
  onBack: () => void;
}

