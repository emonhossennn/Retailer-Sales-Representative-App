import { RetailerService } from './retailer.service';
import { RetailerQueryDto } from './dto/retailer-query.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';
export declare class RetailerController {
    private retailerService;
    constructor(retailerService: RetailerService);
    getRetailers(user: any, query: RetailerQueryDto): Promise<{}>;
    getRetailerDetails(user: any, id: number): Promise<any>;
    updateRetailer(user: any, id: number, dto: UpdateRetailerDto): Promise<any>;
}
