import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { RetailerService } from './retailer.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RetailerService', () => {
  let service: RetailerService;
  let prismaService: PrismaService;
  let cacheManager: any;

  const mockPrismaService = {
    retailer: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    salesRepRetailer: {
      findUnique: jest.fn(),
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetailerService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<RetailerService>(RetailerService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRetailersForSR', () => {
    it('should return paginated retailers for SR', async () => {
      const mockRetailers = [
        {
          id: 1,
          uid: 'R001',
          name: 'Retailer 1',
          region: { id: 1, name: 'Dhaka' },
        },
      ];

      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.retailer.findMany.mockResolvedValue(mockRetailers);
      mockPrismaService.retailer.count.mockResolvedValue(1);

      const result = await service.getRetailersForSR(1, { page: 1, limit: 20 });

      expect(result.data).toEqual(mockRetailers);
      expect(result.meta.total).toBe(1);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('updateRetailer', () => {
    it('should update retailer fields for assigned SR', async () => {
      const mockAssignment = { salesRepId: 1, retailerId: 1 };
      const mockUpdatedRetailer = { id: 1, points: 100, routes: 'Route A' };

      mockPrismaService.salesRepRetailer.findUnique.mockResolvedValue(mockAssignment);
      mockPrismaService.retailer.update.mockResolvedValue(mockUpdatedRetailer);

      const result = await service.updateRetailer(1, 1, { points: 100, routes: 'Route A' });

      expect(result).toEqual(mockUpdatedRetailer);
      expect(mockCacheManager.del).toHaveBeenCalled();
    });

    it('should throw NotFoundException if retailer not assigned to SR', async () => {
      mockPrismaService.salesRepRetailer.findUnique.mockResolvedValue(null);

      await expect(service.updateRetailer(1, 1, { points: 100 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
