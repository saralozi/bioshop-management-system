import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSaleDto } from '../products/dto/create-sale.dto.js';

@Injectable()
export class SalesService {

    // inject PrismaService into the SalesService class so that we can interact with the database
    constructor(private readonly prisma: PrismaService) { }

    // create e new sale in the database that follows the structure of CreateSaleDto
    async create(createSaleDto: CreateSaleDto) {
        const { items } = createSaleDto; // destructuring

        // items is an array of CreateSaleItemDto objects, each containing productId and quantity
        const saleItems: {
            productId: number;
            quantity: number;
            unitPrice: number;
        }[] = [];

        let totalAmount = 0;

        // loop through every item in the sale
        for (const item of items) {
            const product = await this.prisma.product.findUnique({
                where: {
                    id: item.productId,
                },
            });

            if (!product) {
                throw new BadRequestException(
                    `Product with id ${item.productId} does not exist.`,
                );
            }

            if (!product.sellingPrice) {
                throw new BadRequestException(
                    `Product with id ${item.productId} does not have a selling price.`,
                );
            }

            // calculate the subtotal for this item and add it to the total amount
            const unitPrice = Number(product.sellingPrice);
            const subtotal = unitPrice * item.quantity;

            totalAmount = totalAmount + subtotal;

            // push the sale item into the saleItems array
            saleItems.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice,
            });
        }

        // start a transaction & run everything isnide this as one protected DB operation
        // tx -> Prisma inside the transaction, we use this to make sure that if any part of the transaction fails, everything is rolled back and no changes are made to the database
        const sale = await this.prisma.$transaction(async (tx) => {

            // Helper used only inside this transaction
            // Deduct stock for a specific product using FEFO (First Expired, First Out) method
            const deductStockForItem = async (
                productId: number,
                quantity: number,
            ) => {

                // Get available batches using FEFO
                const batches = await tx.inventoryBatch.findMany({
                    where: {
                        productId,
                        quantity: {
                            gt: 0, // only consider batches with quantity greater than 0
                        },
                    },
                    orderBy: {
                        expiryDate: {
                            sort: 'asc',
                            nulls: 'last', // batches without an expiry date will be considered last
                        },
                    },
                });

                // Calculate total available stock
                let totalStock = 0;

                for (const batch of batches) {
                    totalStock += batch.quantity;
                }

                // Check if enough stock exists
                if (totalStock < quantity) {
                    throw new BadRequestException(
                        `Not enough stock for product with id ${productId}. Requested: ${quantity}, Available: ${totalStock}`,
                    );
                }

                // Quantity we still need to take from batches
                let remainingQuantity = quantity;

                // Deduct using FEFO

                // Go through the batches one by one
                for (const batch of batches) {

                    // check if we still need to take anything
                    if (remainingQuantity === 0) {
                        break;
                    }

                    // decide how much to take from current batch
                    const quantityToTake = Math.min(
                        batch.quantity,
                        remainingQuantity,
                    );

                    // update the batch quantity and create a stock movement record
                    await tx.inventoryBatch.update({
                        where: {
                            id: batch.id,
                        },
                        data: {
                            quantity: {
                                decrement: quantityToTake,
                            },
                        },
                    });

                    await tx.stockMovement.create({
                        data: {
                            inventoryBatchId: batch.id,
                            quantity: -quantityToTake,
                            type: 'SALE',
                        },
                    });

                    remainingQuantity -= quantityToTake;
                }
            };

            // Create Sale + SaleItems

            // Inside the transaction create e new row in the Sale table and wait until Prisma finishes
            const createdSale = await tx.sale.create({
                data: {
                    totalAmount,
                    items: {
                        create: saleItems,
                    },
                },
                include: {
                    items: true,
                },
            });

            // Loop through every product in the sale request & call helper function to deduct stock for each product

            // Inside the function Prisma: 
            // finds the batches
            // checks stock
            // takes from neares expiry batch first
            // updates the batch quantity
            // creates SALE stock movement record
            for (const item of items) {
                await deductStockForItem(
                    item.productId,
                    item.quantity,
                );
            }

            return createdSale;
        });

        return sale; // return the result of the whole transaction from service method

    }

    // Find all sales in DB
    async findAll() {
        return this.prisma.sale.findMany({
            include: {
                items: {
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

    // Find a sale by its ID in DB
    async findById(id: number) {
        const sale = await this.prisma.sale.findUnique({
            where: {
                id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!sale) {
            throw new BadRequestException(
                `Sale with id ${id} does not exist.`,
            );
        }

        return sale;
    }
}