import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Param
} from '@nestjs/common';

import { InventoryService } from './inventory.service.js';
import { CreateInventoryBatchDto } from './dto/create-inventory-batch.dto.js';

// Every route will start with /inventory
@Controller('inventory')
export class InventoryController {
  // inject the InventoryService into the controller
  constructor(
    private readonly inventoryService: InventoryService,
  ) { }

  // Run this function when someone sends a POST request to /inventory
  @Post()
  create(
    // Take JSON data from request body and converts it into an instance of CreateInventoryBatchDto
    @Body()
    createInventoryBatchDto: CreateInventoryBatchDto,
  ) {
    // Call service, sending the validated request data
    return this.inventoryService.create(
      createInventoryBatchDto,
    );
  }

  @Get('summary')
  getInventorySummary() {
    return this.inventoryService.getInventorySummary();
  }

  // GET /inventory/expiring-soon
  @Get('expiry-alerts')
  getExpiryAlerts() {
    return this.inventoryService.getExpiryAlerts();
  }

  // This controller method connect a URL like GET /inventory/product/5/stock 
  // to the service method

  // Run this method when someone sends a GET request matching this route
  @Get('product/:productId/stock')
  getProductStock(
    @Param('productId') // reads the value from URL
    productId: string,
  ) {
    return this.inventoryService.getProductStock(Number(productId))
  } // convert to number, calls service, get the result

  @Get('out-of-stock')
  findOutOfStock() {
    return this.inventoryService.findOutOfStock();
  }

  @Get('low-stock')
  findLowStock() {
    return this.inventoryService.findLowStock();
  }

  // This creates GET /inventory
  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  // Supports GET /inventory/product/5
  @Get('product/:productId')
  findByProductId(
    @Param('productId')
    productId: string,
  ) {
    return this.inventoryService.findByProductId(Number(productId))
  }

  // Wne client sends GET request to /inventory/movements, run this method
  @Get('movements')
  findStockMovements(
    @Query('productId') productId?: string, // read the productId value from the query string in URL
  ) {
    return this.inventoryService.findStockMovements(
      productId ? Number(productId) : undefined,
    );
  }

}

// Complete basic read/create inventory flow
// POST /inventory -> create a new batch
// GET /inventory -> get every inventory batch
// GET /inventory/product/5 -> get all batches for product 5
// GET /inventory/product/5/stock -> get total stock for product 5 + its batches