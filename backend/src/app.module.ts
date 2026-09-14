// Main application module that imports other modules and sets up the application
// Main container that connects all features

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProductsModule } from './products/products.module.js';
import { InventoryModule } from './inventory/inventory.module.js';
import { SalesModule } from './sales/sales.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { BrandsModule } from './brands/brands.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ProductTypesModule } from './product-types/product-types.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ProductsModule,
    InventoryModule,
    SalesModule,
    DashboardModule,
    BrandsModule,
    CategoriesModule,
    ProductTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// When NestJS starts, it starts from AppModule & discovers rest of app from there
// ConfigModule -> loads environment variables from .env file and makes them available throughout the app
