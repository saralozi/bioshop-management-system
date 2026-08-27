// Makes the PrismService available across NestJS

// Global -> exported services can be used everywhere
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
@Global() 
// Make PrismaModule global
// Import PrismaModule once in AppModule and then services throughout the app can use PrismaService

@Module({
  // Crete & manage an instance of PrismaService
  // providers -> services that can be injected into other services
  providers: [PrismaService],

  // Other modules can use PrismaService
  exports: [PrismaService],
})
export class PrismaModule {}