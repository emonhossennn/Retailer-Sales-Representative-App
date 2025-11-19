import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { CreateTerritoryDto } from './dto/create-territory.dto';

@Injectable()
export class MasterDataService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Regions
  async createRegion(dto: CreateRegionDto) {
    const region = await this.prisma.region.create({ data: dto });
    await this.cacheManager.del('regions:all');
    return region;
  }

  async getRegions() {
    const cached = await this.cacheManager.get('regions:all');
    if (cached) return cached;

    const regions = await this.prisma.region.findMany({ orderBy: { name: 'asc' } });
    await this.cacheManager.set('regions:all', regions, 3600);
    return regions;
  }

  async updateRegion(id: number, dto: CreateRegionDto) {
    const region = await this.prisma.region.update({ where: { id }, data: dto });
    await this.cacheManager.del('regions:all');
    return region;
  }

  async deleteRegion(id: number) {
    await this.prisma.region.delete({ where: { id } });
    await this.cacheManager.del('regions:all');
    return { message: 'Region deleted' };
  }

  // Areas
  async createArea(dto: CreateAreaDto) {
    const area = await this.prisma.area.create({ data: dto, include: { region: true } });
    await this.cacheManager.del('areas:all');
    return area;
  }

  async getAreas() {
    const cached = await this.cacheManager.get('areas:all');
    if (cached) return cached;

    const areas = await this.prisma.area.findMany({
      include: { region: true },
      orderBy: { name: 'asc' },
    });
    await this.cacheManager.set('areas:all', areas, 3600);
    return areas;
  }

  async updateArea(id: number, dto: CreateAreaDto) {
    const area = await this.prisma.area.update({
      where: { id },
      data: dto,
      include: { region: true },
    });
    await this.cacheManager.del('areas:all');
    return area;
  }

  async deleteArea(id: number) {
    await this.prisma.area.delete({ where: { id } });
    await this.cacheManager.del('areas:all');
    return { message: 'Area deleted' };
  }

  // Distributors
  async createDistributor(dto: CreateDistributorDto) {
    const distributor = await this.prisma.distributor.create({ data: dto });
    await this.cacheManager.del('distributors:all');
    return distributor;
  }

  async getDistributors() {
    const cached = await this.cacheManager.get('distributors:all');
    if (cached) return cached;

    const distributors = await this.prisma.distributor.findMany({ orderBy: { name: 'asc' } });
    await this.cacheManager.set('distributors:all', distributors, 3600);
    return distributors;
  }

  async updateDistributor(id: number, dto: CreateDistributorDto) {
    const distributor = await this.prisma.distributor.update({ where: { id }, data: dto });
    await this.cacheManager.del('distributors:all');
    return distributor;
  }

  async deleteDistributor(id: number) {
    await this.prisma.distributor.delete({ where: { id } });
    await this.cacheManager.del('distributors:all');
    return { message: 'Distributor deleted' };
  }

  // Territories
  async createTerritory(dto: CreateTerritoryDto) {
    const territory = await this.prisma.territory.create({
      data: dto,
      include: { area: { include: { region: true } } },
    });
    await this.cacheManager.del('territories:all');
    return territory;
  }

  async getTerritories() {
    const cached = await this.cacheManager.get('territories:all');
    if (cached) return cached;

    const territories = await this.prisma.territory.findMany({
      include: { area: { include: { region: true } } },
      orderBy: { name: 'asc' },
    });
    await this.cacheManager.set('territories:all', territories, 3600);
    return territories;
  }

  async updateTerritory(id: number, dto: CreateTerritoryDto) {
    const territory = await this.prisma.territory.update({
      where: { id },
      data: dto,
      include: { area: { include: { region: true } } },
    });
    await this.cacheManager.del('territories:all');
    return territory;
  }

  async deleteTerritory(id: number) {
    await this.prisma.territory.delete({ where: { id } });
    await this.cacheManager.del('territories:all');
    return { message: 'Territory deleted' };
  }
}
