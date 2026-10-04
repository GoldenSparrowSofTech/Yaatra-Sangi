import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(@Body() body: { text: string; source: string }) {
    return this.reviewsService.create(body);
  }

  @Get()
  async getReviews() {
    return this.reviewsService.findAll();
  }
}
