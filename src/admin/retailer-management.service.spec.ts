import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { RetailerManagementService } from './retailer-management.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RetailerManagementService', () => {
  let service: RetailerManagementService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    salesRep: {
      findUnique: jest.fn(),
    },
    retailer: {
      findMany: jest.fn(),
      createMany: jest.fn(),
    },
    salesRepRetailer: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetailerManagementService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RetailerManagementService>(RetailerManagementService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('assignRetailers', () => {
    it('should assign retailers to SR successfully', async () => {
      const dto = { salesRepId: 1, retailerIds: [1, 2, 3] };
      const mockSR = { id: 1, username: 'sr1' };
      const mockRetailers = [{ id: 1 }, { id: 2 }, { id: 3 }];

      mockPrismaService.salesRep.findUnique.mockResolvedValue(mockSR);
      mockPrismaService.retailer.findMany.mockResolvedValue(mockRetailers);
      mockPrismaService.salesRepRetailer.createMany.mockResolvedValue({ count: 3 });

      const result = await service.assignRetailers(dto);

      expect(result.message).toContain('Assigned 3 retailers');
      expect(mockPrismaService.salesRepRetailer.createMany).toHaveBeenCalled();
    });

    it('should throw BadRequestException if SR not found', async () => {
      mockPrismaService.salesRep.findUnique.mockResolvedValue(null);

      await expect(
        service.assignRetailers({ salesRepId: 999, retailerIds: [1] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if some retailers not found', async () => {
      const mockSR = { id: 1, username: 'sr1' };
      mockPrismaService.salesRep.findUnique.mockResolvedValue(mockSR);
      mockPrismaService.retailer.findMany.mockResolvedValue([{ id: 1 }]);

      await expect(
        service.assignRetailers({ salesRepId: 1, retailerIds: [1, 2, 3] }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('unassignRetailers', () => {
    it('should unassign retailers from SR successfully', async () => {
      const dto = { salesRepId: 1, retailerIds: [1, 2] };
      mockPrismaService.salesRepRetailer.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.unassignRetailers(dto);

      expect(result.message).toContain('Unassigned 2 retailers');
    });
  });
});
