import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductsService {

    // dependency injection
    // class constructor that NestJS calles when it creates ProductsSerivce
    // prisma: PrismaService -> I want avariable called prisma of that type
    // private so that only this class can use it
    // readonly so that it cannot be changed after initialization

    // ProductsService needs to use PrismaService to access the database, so we inject it into the constructor of ProductsService. This allows us to use the methods provided by PrismaService to interact with the database in a clean and organized manner.
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.product.findMany({
            include: {
                brand: true,
                category: true,
                productType: true,
                inventoryBatches: true,
            },
        });
    }
    // Fetch all products & also include their related details

    // incoming product data has to be shaped like CreateProductDto, so we use that as the type of the parameter
    // Tell Prisma to create a new row in Product table
    // Pass the incoming data to Prisma so that it can be saved in the database

    async create(createProductDto: CreateProductDto) {

        // destructuring (take values out and store in shorter variables)
        const {
            brandId,
            categoryId,
            productTypeId,
        } = createProductDto;

        // find one category whose id equals the categoryId the user sent
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });

        // If that category doen't exist, throw an error. This is a validation step to ensure that the product being created is associated with a valid category.
        if (!category) {
            throw new BadRequestException('Category does not exist.');
        }

        const productType = await this.prisma.productType.findUnique({
            where: { id: productTypeId },
        });

        if (!productType) {
            throw new BadRequestException('Product type does not exist.');
        }

        if (brandId !== undefined) {
            const brand = await this.prisma.brand.findUnique({
                where: { id: brandId },
            });

            if (!brand) {
                throw new BadRequestException('Brand does not exist.');
            }
        }

        // Check name, size and brandId because these 2 fields together define the specific
        // product variant. If a product with the same name, size, and brandId already exists, 
        // we should not allow creating a duplicate entry in the database. 
        // This is a validation step to ensure data integrity and prevent duplicate products from being created.
        const existingProduct = await this.prisma.product.findFirst({
            where: {
                name: createProductDto.name,
                size: createProductDto.size,
                brandId: createProductDto.brandId,
            }
        })

        if (existingProduct) {
            throw new BadRequestException("This product already exists");
        }

        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    // Change Product X's low stock threshold
    async updateLowStockThreshold(
        productId: number,
        lowStockThreshold: number,
    ) {
        // Check that the product exists
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

        // Update one Produt row
        return this.prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                lowStockThreshold,
            },
        });
    }


}