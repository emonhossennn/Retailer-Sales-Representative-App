import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MasterDataService } from './master-data.service';
import { PrismaService } from '../prisma/prisma.service';

describe('MasterDataService', () => {
  let service: MasterDataService;
  let prismaService: PrismaService;
  let cacheManager: any;

  const mockPrismaService = {
    region: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    area: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
        MasterDataService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<MasterDataService>(MasterDataService);
    prismaService = module.get<PrismaService>(PrismaService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRegion', () => {
    it('should create a region and clear cache', async () => {
      const dto = { name: 'Dhaka' };
      const mockRegion = { id: 1, ...dto };

      mockPrismaService.region.create.mockResolvedValue(mockRegion);

      const result = await service.createRegion(dto);

      expect(result).toEqual(mockRegion);
      expect(mockCacheManager.del).toHaveBeenCalledWith('regions:all');
    });
  });

  describe('getRegions', () => {
    it('should return cached regions if available', async () => {
      const cachedRegions = [{ id: 1, name: 'Dhaka' }];
      mockCacheManager.get.mockResolvedValue(cachedRegions);

      const result = await service.getRegions();

      expect(result).toEqual(cachedRegions);
      expect(mockPrismaService.region.findMany).not.toHaveBeenCalled();
    });

    it('should fetch and cache regions if not cached', async () => {
      const mockRegions = [{ id: 1, name: 'Dhaka' }];
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.region.findMany.mockResolvedValue(mockRegions);

      const result = await service.getRegions();

      expect(result).toEqual(mockRegions);
      expect(mockCacheManager.set).toHaveBeenCalledWith('regions:all', mockRegions, 3600);
    });
  });
});
