import { RetailerManagementService } from './retailer-management.service';
import { AssignRetailersDto } from './dto/assign-retailers.dto';
export declare class RetailerManagementController {
    private retailerManagementService;
    constructor(retailerManagementService: RetailerManagementService);
    assignRetailers(dto: AssignRetailersDto): Promise<any>;
    unassignRetailers(dto: AssignRetailersDto): Promise<{
        message: string;
    }>;
    importRetailers(file: any): Promise<unknown>;
}
