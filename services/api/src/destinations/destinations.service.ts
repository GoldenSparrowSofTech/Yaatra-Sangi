import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.destination.findMany();
  }

  async findOne(id: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { id: id.toLowerCase() },
      include: {
        placesToVisit: true,
        hotels: true,
        tours: true
      }
    });

    if (!destination) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }

    return destination;
  }

  async create(data: { name: string; state: string; country: string; latitude: number; longitude: number }) {
    return this.prisma.destination.create({
      data,
    });
  }

  async search(query: string) {
    return this.prisma.destination.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
  }
}
