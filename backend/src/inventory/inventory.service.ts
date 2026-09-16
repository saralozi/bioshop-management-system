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

  // Method to calculate total stock so we don't need to repeat the same operations in every function
  // private -> so that it only can be used inside this service file
  // batches -> variable we pass into the function with quantity field
  private calculateTotalStock(batches: { quantity: number }[]) {
    let totalStock = 0;

    for (const batch of batches) {
      totalStock = totalStock + batch.quantity;
    }
    return totalStock;
  }

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
        stockMovements: {
          create: { quantity, type: 'STOCK_IN' }
        }
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

    const totalStock = this.calculateTotalStock(batches);

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

  async findOutOfStock() {
    const products = await this.prisma.product.findMany({
      include: {
        inventoryBatches: true,
      },
    });

    const outOfStockProducts = [];

    for (const product of products) {
      const totalStock = this.calculateTotalStock(product.inventoryBatches);

      if (totalStock === 0) {
        outOfStockProducts.push({
          id: product.id,
          name: product.name,
          size: product.size,
          totalStock,
        });
      }
    }

    return outOfStockProducts;
  }

  async findLowStock() {
    // Get all products & include all inventory batches
    const products = await this.prisma.product.findMany({
      include: {
        inventoryBatches: true,
      },
    });

    const lowStockProducts = [];

    // Loop through every product & add all batch quantities
    for (const product of products) {
      const totalStock = this.calculateTotalStock(product.inventoryBatches);

      // Add to low stock products if total stock is < 5
      if (totalStock > 0 && totalStock <= product.lowStockThreshold) {
        lowStockProducts.push({
          id: product.id,
          name: product.name,
          size: product.size,
          totalStock,
        });
      }
    }

    return lowStockProducts;
  }

  // Retrieve all stock movements, together with the batch and product they belong to
  // newest first
  async findStockMovements(productId?: number) {
    return this.prisma.stockMovement.findMany({
      where: productId
        ? {
          inventoryBatch: {
            productId
          }
        }
        : undefined,

      include: {
        inventoryBatch: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Create a summary of invetory per product
  async getInventorySummary() {

    // fetch all products with their brands and inventory batches
  const products = await this.prisma.product.findMany({
    include: {
      brand: true,
      inventoryBatches: true,
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = [];

  // loop over every product to calculate inentory summary
  for (const product of products) {
    let totalStock = 0;

    // loop over every batch of the product to calculate total stock
    for (const batch of product.inventoryBatches) {
      totalStock += batch.quantity;
    }

    let stockStatus = 'IN_STOCK';

    if (totalStock === 0) {
      stockStatus = 'OUT_OF_STOCK';
    } else if (totalStock <= product.lowStockThreshold) {
      stockStatus = 'LOW_STOCK';
    }

    // new array of active batches (quantity > 0 and expiryDate is not null)
    const activeBatches = product.inventoryBatches.filter(
      (batch) =>
        batch.quantity > 0 &&
        batch.expiryDate !== null,
    );

    // default expiry status
    let expiryStatus = 'NO_ALERT';

    // only calculate expiry warning if there is at least one batch with quantity & expiry date


    if (activeBatches.length > 0) {

      // initially assume the first batch has the nearest expiry
      let nearestExpiry = activeBatches[0].expiryDate!;

      // loop over all relevant batches and find the earliest expiry date
      for (const batch of activeBatches) {
        if (
          batch.expiryDate &&
          batch.expiryDate < nearestExpiry
        ) {
          nearestExpiry = batch.expiryDate;
        }
      }

      const millisecondsPerDay =
        1000 * 60 * 60 * 24;

      const daysUntilExpiry = Math.ceil(
        (nearestExpiry.getTime() - today.getTime()) /
          millisecondsPerDay,
      );

      if (daysUntilExpiry <= 30) {
        expiryStatus = 'URGENT';
      } else if (daysUntilExpiry <= 90) {
        expiryStatus = 'HIGH';
      } else if (daysUntilExpiry <= 180) {
        expiryStatus = 'WARNING';
      }
    }

    // add product summary to result
    result.push({
      productId: product.id,
      name: product.name,
      brand: product.brand?.name ?? null,
      size: product.size,
      totalStock,
      stockStatus,
      expiryStatus,
    });
  }

  return result;
}


}




// findAll -> all batches in inventory
// findByProductId(productId) -> all batches for one product
// getProductStock(productId) -> all batches for one product + summed total quantity
