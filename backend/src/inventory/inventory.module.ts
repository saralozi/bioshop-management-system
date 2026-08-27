// Tell NestJS which pieces belong to the Inventory feature.

import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller.js';
import { InventoryService } from './inventory.service.js';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}


// Provider -> something that NEst can create & inject