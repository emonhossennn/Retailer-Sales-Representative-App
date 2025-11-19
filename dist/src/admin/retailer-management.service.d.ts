import { PrismaService } from '../prisma/prisma.service';
import { AssignRetailersDto } from './dto/assign-retailers.dto';
export declare class RetailerManagementService {
    private prisma;
    constructor(prisma: PrismaService);
    assignRetailers(dto: AssignRetailersDto): Promise<any>;
    unassignRetailers(dto: AssignRetailersDto): Promise<{
        message: string;
    }>;
    importRetailersFromCSV(file: any): Promise<unknown>;
}
