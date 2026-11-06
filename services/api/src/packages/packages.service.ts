import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(location?: string) {
    let whereClause = {};
    if (location) {
      whereClause = { destination: { contains: location } };
    }
    const packages = await this.prisma.package.findMany({ where: whereClause });
    return packages.map((p) => {
      let parsedHighlights: string[] = [];
      try {
        parsedHighlights = typeof p.highlights === 'string' ? JSON.parse(p.highlights) : p.highlights;
      } catch {
        parsedHighlights = [p.highlights];
      }

      const price = typeof p.price === 'object' && (p.price as any)?.toNumber
        ? (p.price as any).toNumber()
        : Number(p.price) || 0;

      return {
        id: p.id,
        slug: p.slug,
        title: p.name,
        duration: p.duration,
        price,
        image: p.image,
        rating: p.rating,
        reviews: 124, // Mock
        features: parsedHighlights,
        vendorName: 'Local Agent',
      };
    });
  }
}
