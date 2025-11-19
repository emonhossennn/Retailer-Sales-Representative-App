import { Module } from '@nestjs/common';
import { MasterDataController } from './master-data.controller';
import { MasterDataService } from './master-data.service';
import { RetailerManagementController } from './retailer-management.controller';
import { RetailerManagementService } from './retailer-management.service';

@Module({
  controllers: [MasterDataController, RetailerManagementController],
  providers: [MasterDataService, RetailerManagementService],
})
export class AdminModule {}
