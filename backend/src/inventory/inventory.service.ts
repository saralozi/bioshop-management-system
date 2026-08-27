import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInventoryBatchDto } from './dto/create-inventory-batch.dto.js';

// Makes Nest able to inject InventoryService into other services / controllers
@Injectable()
export class InventoryService {
  // Inject PrismaService
  constructor(private readonly prisma: PrismaService) { }

  // Create a new inventory batch in the database

  // Receive data from controller
  // Validate data using CreateInventoryBatchDto (so that it should follow structure & validation rules we defined in DTO)
  async create(createInventoryBatchDto: CreateInventoryBatchDto) {

    // Extract values from DTO (destructuring)
    const { productId, quantity, expiryDate } =
      createInventoryBatchDto;

    // Check if product exists in the database
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new BadRequestException(
        'Product does not exist.',
      );
    }

    // Create a new inventory batch in the database with the provided data
    return this.prisma.inventoryBatch.create({
      data: {
        productId,
        quantity,
        expiryDate: expiryDate
          ? new Date(expiryDate)
          : null,
      },
    });
  }

  // Retrieve all inventory batches for a specific product from DB ordered by nearest expiry date
  async findByProductId(productId: number) {
    return this.prisma.inventoryBatch.findMany({
      where: {
        productId,
      },
      orderBy: {
        expiryDate: 'asc',
      }
    })
  }

  // Calculate total stock of a specific product by summing up the quantity of all inventory batches for that product
  async getProductStock(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new BadRequestException(
        'Product does not exist.'
      );
    }

    const batches = await this.prisma.inventoryBatch.findMany({
      where: { productId },
    })

    let totalStock = 0;

    for (const batch of batches) {
      totalStock = totalStock + batch.quantity;
    }

    return {
      productId, totalStock, batches
    }
  }

  // batches -> array
  // reduce() -> array method that takes many values a& reduces them into one final value
  // it takes the batches array for that product and returns the sum of its elements

  // Retrieve all product batches in the inventory
  async findAll() {
    return this.prisma.inventoryBatch.findMany({
      include: { product: true },
      orderBy: { expiryDate: 'asc' },
    })
  }

  // Find inventory batches whose expiry date is within a certain future period
  async getExpiryAlerts() {

    // Get today's date
    const today = new Date();

    // Create another date object
    // Get current day of the month and add X days
    // JS handles the month change auto
    // setDate() changes the date
    const date30 = new Date();
    date30.setDate(date30.getDate() + 30);

    const date90 = new Date();
    date90.setDate(date90.getDate() + 90);

    const date180 = new Date();
    date180.setDate(date180.getDate() + 180);

    // One Prisma query -> get every batch within 180 days
    // Split batches into urgent, high, warning
    const batches = await this.prisma.inventoryBatch.findMany({
      where: {
        expiryDate: {
          gte: today,
          lte: date180,
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        expiryDate: 'asc',
      },
    });

    const urgent = [];
    const high = [];
    const warning = [];

    for (const batch of batches) {
      if (!batch.expiryDate) {
        continue;
      }

      if (batch.expiryDate <= date30) {
        urgent.push(batch);
      } else if (batch.expiryDate <= date90) {
        high.push(batch);
      } else {
        warning.push(batch);
      }
    }


    return {
      urgent,
      high,
      warning,
    };
  }
}

// findAll -> all batches in inventory
// findByProductId(productId) -> all batches for one product
// getProductStock(productId) -> all batches for one product + summed total quantity
