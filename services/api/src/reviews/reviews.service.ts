import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  async create(data: { text: string; source: string }) {
    return { id: 1, ...data, createdAt: new Date() };
  }

  async findAll() {
    return [];
  }
}
