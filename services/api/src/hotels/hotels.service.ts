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
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      };
    }
    
    const hotels = await this.prisma.hotel.findMany({
      where: whereClause,
      include: { destination: true, roomTypes: true },
    });

    // Map DB data to match frontend format
    return hotels.map((hotel: any) => {
      // Find the cheapest room for base price
      const price = hotel.roomTypes && hotel.roomTypes.length > 0 
        ? Math.min(...hotel.roomTypes.map((rt: any) => Number(rt.basePrice))) 
        : 5000; // Default fallback price

      return {
        id: hotel.id,
        name: hotel.name,
        location: hotel.address + (hotel.destination ? `, ${hotel.destination.name}` : ''),
        rating: 4.5, // Default for now
        reviews: 120, // Default for now
        price: price,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Default image
        amenities: ['Pool', 'WiFi'], // Default amenities
        featured: false,
      };
    });
  }

  async findOne(id: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
      include: { destination: true, roomTypes: true }
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID ${id} not found`);
    }
    return hotel;
  }
}
