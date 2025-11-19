import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { RetailerQueryDto } from './dto/retailer-query.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';
export declare class RetailerService {
    private prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    getRetailersForSR(salesRepId: number, query: RetailerQueryDto): Promise<{}>;
    getRetailerDetails(retailerId: number, salesRepId: number): Promise<any>;
    updateRetailer(retailerId: number, salesRepId: number, dto: UpdateRetailerDto): Promise<any>;
}
