// Create stock, not creating a product. 
// Which products? How many? When does this batch expire?

import {
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateInventoryBatchDto {
  
  // batch must belong to a product
  @IsInt()
  @IsPositive()
  productId!: number;

  // how many units exist in this batch
  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}