// Describes what the request body should look like
// Validate the new threshold value before it reaches the service

import {IsInt, IsPositive,} from 'class-validator';

export class UpdateLowStockThresholdDto {
  @IsInt()
  @IsPositive()
  lowStockThreshold!: number;
}