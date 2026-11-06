import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TaxisService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pickup?: string, dropoff?: string) {
    let whereClause = {};
    if (pickup) {
      whereClause = { location: { contains: pickup } };
    }
    const taxis = await this.prisma.taxi.findMany({ where: whereClause });
    return taxis.map((t) => {
      let parsedFeatures: string[] = [];
      try {
        parsedFeatures = typeof t.features === 'string' ? JSON.parse(t.features) : t.features;
      } catch {
        parsedFeatures = [t.features];
      }

      const price = typeof t.price === 'object' && (t.price as any)?.toNumber
        ? (t.price as any).toNumber()
        : Number(t.price) || 0;

      return {
        ...t,
        price,
        features: parsedFeatures,
      };
    });
  }
}
