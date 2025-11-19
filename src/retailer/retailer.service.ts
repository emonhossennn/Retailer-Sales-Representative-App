import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { RetailerQueryDto } from './dto/retailer-query.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';

@Injectable()
export class RetailerService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getRetailersForSR(salesRepId: number, query: RetailerQueryDto) {
    const cacheKey = `retailers:sr:${salesRepId}:${JSON.stringify(query)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const { page = 1, limit = 20, search, regionId, areaId, distributorId, territoryId } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      salesReps: { some: { salesRepId } },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { uid: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (regionId) where.regionId = regionId;
    if (areaId) where.areaId = areaId;
    if (distributorId) where.distributorId = distributorId;
    if (territoryId) where.territoryId = territoryId;

    const [retailers, total] = await Promise.all([
      this.prisma.retailer.findMany({
        where,
        skip,
        take: limit,
        include: {
          region: { select: { id: true, name: true } },
          area: { select: { id: true, name: true } },
          distributor: { select: { id: true, name: true } },
          territory: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.retailer.count({ where }),
    ]);

    const result = {
      data: retailers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cacheManager.set(cacheKey, result, 60);
    return result;
  }

  async getRetailerDetails(retailerId: number, salesRepId: number) {
    const retailer = await this.prisma.retailer.findFirst({
      where: {
        id: retailerId,
        salesReps: { some: { salesRepId } },
      },
      include: {
        region: true,
        area: true,
        distributor: true,
        territory: true,
      },
    });

    if (!retailer) {
      throw new NotFoundException('Retailer not found or not assigned to you');
    }

    return retailer;
  }

  async updateRetailer(retailerId: number, salesRepId: number, dto: UpdateRetailerDto) {
    const exists = await this.prisma.salesRepRetailer.findUnique({
      where: {
        salesRepId_retailerId: { salesRepId, retailerId },
      },
    });

    if (!exists) {
      throw new NotFoundException('Retailer not found or not assigned to you');
    }

    const updated = await this.prisma.retailer.update({
      where: { id: retailerId },
      data: dto,
    });

    await this.cacheManager.del(`retailers:sr:${salesRepId}:*`);
    return updated;
  }
}
