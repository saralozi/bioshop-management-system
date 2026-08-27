// Database connection & database methods

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService // one standard place for DB access
  extends PrismaClient
  implements OnModuleInit
{
  // constructor runs when NestJS creates the PrismaService
  // Inside constructor we prepare the PostgreSQL connection
  constructor() {
    // Create PostgreSQL adapter
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    // super -> to initialize the PrismaClient with the adapter
    // PrismaClient knows which PostgreSQL database to connect to
    super({ adapter });
  }

  // onModuleInit runs when NestJS initializes the PrismaService
  // connect opens the DB connection
  async onModuleInit() {
    await this.$connect();
  }
}