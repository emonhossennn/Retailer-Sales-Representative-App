import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { CreateTerritoryDto } from './dto/create-territory.dto';
export declare class MasterDataService {
    private prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    createRegion(dto: CreateRegionDto): Promise<any>;
    getRegions(): Promise<any>;
    updateRegion(id: number, dto: CreateRegionDto): Promise<any>;
    deleteRegion(id: number): Promise<{
        message: string;
    }>;
    createArea(dto: CreateAreaDto): Promise<any>;
    getAreas(): Promise<any>;
    updateArea(id: number, dto: CreateAreaDto): Promise<any>;
    deleteArea(id: number): Promise<{
        message: string;
    }>;
    createDistributor(dto: CreateDistributorDto): Promise<any>;
    getDistributors(): Promise<any>;
    updateDistributor(id: number, dto: CreateDistributorDto): Promise<any>;
    deleteDistributor(id: number): Promise<{
        message: string;
    }>;
    createTerritory(dto: CreateTerritoryDto): Promise<any>;
    getTerritories(): Promise<any>;
    updateTerritory(id: number, dto: CreateTerritoryDto): Promise<any>;
    deleteTerritory(id: number): Promise<{
        message: string;
    }>;
}
