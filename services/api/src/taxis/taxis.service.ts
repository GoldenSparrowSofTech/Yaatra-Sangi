import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TaxisService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pickup?: string, dropoff?: string) {
    // In the future, this will be dynamically queried from this.prisma.taxiVehicle
    // For now, we simulate a dynamic pricing response based on locations
    let baseMultiplier = 1;
    if (pickup && dropoff && pickup !== dropoff) {
       baseMultiplier = 1.2; // Increase price slightly if it's a valid route
    }

    return [
      {
        id: 1,
        type: 'Sedan',
        model: 'Swift Dzire / Etios',
        capacity: '4 Seats',
        bags: '2 Bags',
        price: Math.round(3500 * baseMultiplier),
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: ['AC', 'Free Waiting', 'Verified Driver'],
        recommended: true,
      },
      {
        id: 2,
        type: 'SUV',
        model: 'Innova Crysta / Ertiga',
        capacity: '6 Seats',
        bags: '4 Bags',
        price: Math.round(5200 * baseMultiplier),
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: ['Extra Legroom', 'AC', 'Top Rated'],
        recommended: false,
      },
      {
        id: 3,
        type: 'Luxury',
        model: 'Mercedes / BMW',
        capacity: '4 Seats',
        bags: '3 Bags',
        price: Math.round(12000 * baseMultiplier),
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        features: ['Premium Leather', 'Water Bottles', 'Professional Chauffeur'],
        recommended: false,
      }
    ];
  }
}
