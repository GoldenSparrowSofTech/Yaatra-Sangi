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
    return packages.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.name,
      duration: p.duration,
      price: p.price,
      image: p.image,
      rating: p.rating,
      reviews: 124, // Mock
      features: JSON.parse(p.highlights),
      vendorName: 'Local Agent'
    }));
  }
}
