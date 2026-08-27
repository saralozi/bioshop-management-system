// Define Products Feature Module

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}

// This module defines the Products feature of the application. It imports the ProductsController and ProductsService, 
// which handle HTTP requests and business logic related to products, respectively. 
// The @Module decorator is used to configure the module, specifying the controllers and providers that belong to it.