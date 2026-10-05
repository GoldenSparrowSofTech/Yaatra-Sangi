import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class HotelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    let whereClause = {};
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search } },
          { destination: { name: { contains: search } } }
        ]
      };
    }
    
    const hotels = await this.prisma.hotel.findMany({
      where: whereClause,
      include: { destination: true },
    });

    // Map DB data to match frontend format
    return hotels.map((hotel: any) => {
      // Use price from DB if available, else fallback
      const price = hotel.price ? parseInt(hotel.price.replace(/\D/g, '')) || 5000 : 5000;

      return {
        id: hotel.id.toString(),
        name: hotel.name,
        location: hotel.destination ? `${hotel.destination.name}, ${hotel.destination.state}` : '',
        rating: hotel.rating || 4.5,
        reviews: 120, // Default for now
        price: price,
        image: hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        amenities: ['Pool', 'WiFi'], // Default amenities
        featured: false,
      };
    });
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: parseInt(id) },
      include: { destination: true }
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }
}
