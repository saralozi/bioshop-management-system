// Validates a request where one sale contains an array of sale items

// validation decorators
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';

// understand what class each nested object should be transformed into
import { Type } from 'class-transformer';

// Describes one item inside the sale
export class CreateSaleItemDto {
  @IsInt()
  @IsPositive()
  productId!: number;

  @IsInt()
  @IsPositive()
  quantity!: number;
}

// Describes the sale itself
export class CreateSaleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}