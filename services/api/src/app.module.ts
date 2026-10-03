import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DestinationsModule } from './destinations/destinations.module.js';
import { HotelsModule } from './hotels/hotels.module.js';
import { TaxisModule } from './taxis/taxis.module.js';
import { VendorModule } from './vendor/vendor.module.js';
import { LocalRidesModule } from './local-rides/local-rides.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { RestaurantsModule } from './restaurants/restaurants.module.js';
import { PackagesModule } from './packages/packages.module.js';

@Module({
  imports: [PrismaModule, AuthModule, DestinationsModule, HotelsModule, TaxisModule, VendorModule, LocalRidesModule, ReviewsModule, RestaurantsModule, PackagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
