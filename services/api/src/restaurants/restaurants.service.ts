import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(location?: string) {
    let whereClause = {};
    if (location) {
      whereClause = { location: { contains: location } };
    }
    const restaurants = await this.prisma.restaurant.findMany({ where: whereClause });
    return restaurants.map(r => ({
      ...r,
      features: JSON.parse(r.features)
    }));
  }
}
