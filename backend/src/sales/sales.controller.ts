// Exposes Sales logic as an HTPP endpoint to the frontend. 
// The controller is responsible for handling incoming requests, delegating tasks to the service layer, and returning responses to the client.

import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { SalesService } from './sales.service.js';
import { CreateSaleDto } from '../products/dto/create-sale.dto.js';

// all routes in this controller will be prefixed with /sales
@Controller('sales')
export class SalesController {
    // inject SalesService into the SalesController class so that we can delegate tasks to the service layer
    constructor(
        private readonly salesService: SalesService,
    ) { }

    @Post()
    // take request body and validate it against the CreateSaleDto schema, then pass it to the service layer for processing
    create(@Body() createSaleDto: CreateSaleDto) {
        return this.salesService.create(createSaleDto);
    }

    @Get()
    findAll() {
        return this.salesService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.salesService.findById(Number(id));
    }
}
