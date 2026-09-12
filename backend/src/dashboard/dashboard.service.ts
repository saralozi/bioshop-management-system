import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const totalProducts = await this.prisma.product.count();

    const products = await this.prisma.product.findMany({
      include: {
        inventoryBatches: true,
      },
    });

    let lowStockProducts = 0;
    let outOfStockProducts = 0;

    for (const product of products) {
      let totalStock = 0;

      for (const batch of product.inventoryBatches) {
        totalStock += batch.quantity;
      }

      if (totalStock === 0) {
        outOfStockProducts++;
      } else if (totalStock <= product.lowStockThreshold) {
        lowStockProducts++;
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date180 = new Date();
    date180.setDate(date180.getDate() + 180);

    const expiringSoon = await this.prisma.inventoryBatch.count({
      where: {
        expiryDate: {
          gte: today,
          lte: date180,
        },
        quantity: {
          gt: 0,
        },
      },
    });

    const todaySales = await this.prisma.sale.aggregate({
      where: {
        createdAt: {
          gte: today,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      expiringSoon,
      todaySales: todaySales._sum.totalAmount ?? 0,
    };
  }
}