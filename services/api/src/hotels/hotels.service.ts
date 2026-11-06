import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  async findAll(search?: string) {
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search } },
          { destination: { name: { contains: search } } },
        ],
      };
    }

    const hotels = await this.prisma.hotel.findMany({
      where: whereClause,
      include: { destination: true },
    });

    return hotels.map((hotel: any) => this.mapHotelDto(hotel));
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: parseInt(id) },
      include: { destination: true },
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return this.mapHotelDto(hotel);
  }

  /**
   * PostGIS-compatible 10 km default radius search for hotels around destination coordinates.
   */
  async searchNearby(latitude: number, longitude: number, radiusKm: number = 10) {
    const allHotels = await this.prisma.hotel.findMany({
      where: {
        isActive: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      include: { destination: true },
    });

    const nearbyHotels = allHotels
      .map((hotel) => {
        const distanceKm = this.calculateDistanceKm(
          latitude,
          longitude,
          hotel.latitude!,
          hotel.longitude!,
        );
        return {
          ...this.mapHotelDto(hotel),
          distanceKm,
        };
      })
      .filter((h) => h.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return nearbyHotels;
  }

  private mapHotelDto(hotel: any) {
    let price = 5000;
    if (hotel.price !== undefined && hotel.price !== null) {
      if (typeof hotel.price === 'object' && typeof hotel.price.toNumber === 'function') {
        price = hotel.price.toNumber();
      } else if (typeof hotel.price === 'string') {
        price = parseInt(hotel.price.replace(/\D/g, '')) || 5000;
      } else {
        price = Number(hotel.price) || 5000;
      }
    }

    return {
      id: hotel.id.toString(),
      name: hotel.name,
      location: hotel.location || (hotel.destination ? `${hotel.destination.name}, ${hotel.destination.state}` : ''),
      rating: hotel.rating || 4.5,
      reviews: 120, // Default reviews count
      price,
      image: hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      amenities: hotel.amenities ? hotel.amenities.split(',').map((a: string) => a.trim()) : ['Pool', 'WiFi'],
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      featured: false,
      isVerified: hotel.isVerified ?? true,
    };
  }
}
