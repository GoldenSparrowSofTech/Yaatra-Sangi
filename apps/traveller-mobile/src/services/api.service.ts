import { apiFetch } from '../config/api.js';
import { Destination, Hotel, User } from '../types/index.js';

export const ApiService = {
  async fetchDestinations(): Promise<Destination[]> {
    try {
      const res = await apiFetch('/destinations');
      if (res.ok) {
        return res.json();
      }
      return [];
    } catch {
      return [];
    }
  },

  async fetchHotels(search?: string): Promise<Hotel[]> {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await apiFetch(`/hotels${query}`);
      if (res.ok) {
        return res.json();
      }
      return [];
    } catch {
      return [];
    }
  },

  async fetchHotelsNearby(lat: number, lng: number, radius = 10): Promise<Hotel[]> {
    try {
      const res = await apiFetch(`/hotels/search/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      if (res.ok) {
        return res.json();
      }
      return [];
    } catch {
      return [];
    }
  },

  async optimizeRoute(destinations: any[], mode = 'RECOMMENDED') {
    try {
      const res = await apiFetch('/routing/optimize', {
        method: 'POST',
        body: JSON.stringify({ destinations, mode }),
      });
      if (res.ok) {
        return res.json();
      }
      return null;
    } catch {
      return null;
    }
  },

  async createBookingHold(type: string, resourceId: string, startDate: string, endDate?: string) {
    try {
      const res = await apiFetch('/bookings/hold', {
        method: 'POST',
        body: JSON.stringify({ type, resourceId, startDate, endDate }),
      });
      return res.json();
    } catch (e: any) {
      return { error: e?.message };
    }
  },

  async login(email: string, pass: string): Promise<User | null> {
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          ...data.user,
          access_token: data.access_token,
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  async submitReview(text: string) {
    try {
      const res = await apiFetch('/reviews', {
        method: 'POST',
        body: JSON.stringify({ text, source: 'mobile_app' }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getDestinations(): Promise<Destination[]> {
    return this.fetchDestinations();
  },
};

export const apiService = ApiService;

