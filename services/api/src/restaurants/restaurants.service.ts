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
    return restaurants.map((r) => {
      let parsedFeatures: string[] = [];
      try {
        parsedFeatures = typeof r.features === 'string' ? JSON.parse(r.features) : r.features;
      } catch {
        parsedFeatures = [r.features];
      }

      const priceForTwo = typeof r.priceForTwo === 'object' && (r.priceForTwo as any)?.toNumber
        ? (r.priceForTwo as any).toNumber()
        : Number(r.priceForTwo) || 0;

      return {
        ...r,
        priceForTwo,
        features: parsedFeatures,
      };
    });
  }
}
