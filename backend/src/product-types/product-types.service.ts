import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductTypesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.productType.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}