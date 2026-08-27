// Describe the shape of data we expect when creating a product
// Put validation decorators above DTO properties to ensure data integrity

import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(30)
    name!: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    size?: string;


    @IsOptional()
    @IsNumber()
    @IsPositive()
    costPrice?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    sellingPrice?: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    brandId?: number;

    @IsInt()
    @IsPositive()
    categoryId!: number;

    @IsInt()
    @IsPositive()
    productTypeId!: number;
}