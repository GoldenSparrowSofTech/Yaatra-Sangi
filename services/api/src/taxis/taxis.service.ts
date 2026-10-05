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
    return taxis.map(t => ({
      ...t,
      features: JSON.parse(t.features)
    }));
  }
}
