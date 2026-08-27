// Receive the HTPP request and call the service to handle the request

import { Controller, Get, Body, Post } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

// This controller handles routes starting with /products
@Controller('products')
export class ProductsController {
  // Inject ProductsService into the controller so that we can use it to handle requests related to products
  constructor(
    private readonly productsService: ProductsService,
  ) { }

  // When someone sends a GET request to /products, this method will be called
  // It will call the findAll method of ProductsService to get all products and return them in the response
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // This method handles POST requests to /products
  // Take JSON body sent in HTPP request and convert it to CreateProductDto
  // Call the create method of ProductsService to create a new product in the database
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}