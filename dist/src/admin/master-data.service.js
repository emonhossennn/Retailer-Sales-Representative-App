"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../prisma/prisma.service");
let MasterDataService = class MasterDataService {
    prisma;
    cacheManager;
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async createRegion(dto) {
        const region = await this.prisma.region.create({ data: dto });
        await this.cacheManager.del('regions:all');
        return region;
    }
    async getRegions() {
        const cached = await this.cacheManager.get('regions:all');
        if (cached)
            return cached;
        const regions = await this.prisma.region.findMany({ orderBy: { name: 'asc' } });
        await this.cacheManager.set('regions:all', regions, 3600);
        return regions;
    }
    async updateRegion(id, dto) {
        const region = await this.prisma.region.update({ where: { id }, data: dto });
        await this.cacheManager.del('regions:all');
        return region;
    }
    async deleteRegion(id) {
        await this.prisma.region.delete({ where: { id } });
        await this.cacheManager.del('regions:all');
        return { message: 'Region deleted' };
    }
    async createArea(dto) {
        const area = await this.prisma.area.create({ data: dto, include: { region: true } });
        await this.cacheManager.del('areas:all');
        return area;
    }
    async getAreas() {
        const cached = await this.cacheManager.get('areas:all');
        if (cached)
            return cached;
        const areas = await this.prisma.area.findMany({
            include: { region: true },
            orderBy: { name: 'asc' },
        });
        await this.cacheManager.set('areas:all', areas, 3600);
        return areas;
    }
    async updateArea(id, dto) {
        const area = await this.prisma.area.update({
            where: { id },
            data: dto,
            include: { region: true },
        });
        await this.cacheManager.del('areas:all');
        return area;
    }
    async deleteArea(id) {
        await this.prisma.area.delete({ where: { id } });
        await this.cacheManager.del('areas:all');
        return { message: 'Area deleted' };
    }
    async createDistributor(dto) {
        const distributor = await this.prisma.distributor.create({ data: dto });
        await this.cacheManager.del('distributors:all');
        return distributor;
    }
    async getDistributors() {
        const cached = await this.cacheManager.get('distributors:all');
        if (cached)
            return cached;
        const distributors = await this.prisma.distributor.findMany({ orderBy: { name: 'asc' } });
        await this.cacheManager.set('distributors:all', distributors, 3600);
        return distributors;
    }
    async updateDistributor(id, dto) {
        const distributor = await this.prisma.distributor.update({ where: { id }, data: dto });
        await this.cacheManager.del('distributors:all');
        return distributor;
    }
    async deleteDistributor(id) {
        await this.prisma.distributor.delete({ where: { id } });
        await this.cacheManager.del('distributors:all');
        return { message: 'Distributor deleted' };
    }
    async createTerritory(dto) {
        const territory = await this.prisma.territory.create({
            data: dto,
            include: { area: { include: { region: true } } },
        });
        await this.cacheManager.del('territories:all');
        return territory;
    }
    async getTerritories() {
        const cached = await this.cacheManager.get('territories:all');
        if (cached)
            return cached;
        const territories = await this.prisma.territory.findMany({
            include: { area: { include: { region: true } } },
            orderBy: { name: 'asc' },
        });
        await this.cacheManager.set('territories:all', territories, 3600);
        return territories;
    }
    async updateTerritory(id, dto) {
        const territory = await this.prisma.territory.update({
            where: { id },
            data: dto,
            include: { area: { include: { region: true } } },
        });
        await this.cacheManager.del('territories:all');
        return territory;
    }
    async deleteTerritory(id) {
        await this.prisma.territory.delete({ where: { id } });
        await this.cacheManager.del('territories:all');
        return { message: 'Territory deleted' };
    }
};
exports.MasterDataService = MasterDataService;
exports.MasterDataService = MasterDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], MasterDataService);
//# sourceMappingURL=master-data.service.js.map