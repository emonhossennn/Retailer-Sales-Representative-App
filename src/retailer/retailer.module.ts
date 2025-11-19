import { Module } from '@nestjs/common';
import { RetailerController } from './retailer.controller';
import { RetailerService } from './retailer.service';

@Module({
  controllers: [RetailerController],
  providers: [RetailerService],
  exports: [RetailerService],
})
export class RetailerModule {}
