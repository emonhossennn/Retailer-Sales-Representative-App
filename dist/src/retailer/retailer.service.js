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
exports.RetailerService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../prisma/prisma.service");
let RetailerService = class RetailerService {
    prisma;
    cacheManager;
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async getRetailersForSR(salesRepId, query) {
        const cacheKey = `retailers:sr:${salesRepId}:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const { page = 1, limit = 20, search, regionId, areaId, distributorId, territoryId } = query;
        const skip = (page - 1) * limit;
        const where = {
            salesReps: { some: { salesRepId } },
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { uid: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (regionId)
            where.regionId = regionId;
        if (areaId)
            where.areaId = areaId;
        if (distributorId)
            where.distributorId = distributorId;
        if (territoryId)
            where.territoryId = territoryId;
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
    async getRetailerDetails(retailerId, salesRepId) {
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
            throw new common_1.NotFoundException('Retailer not found or not assigned to you');
        }
        return retailer;
    }
    async updateRetailer(retailerId, salesRepId, dto) {
        const exists = await this.prisma.salesRepRetailer.findUnique({
            where: {
                salesRepId_retailerId: { salesRepId, retailerId },
            },
        });
        if (!exists) {
            throw new common_1.NotFoundException('Retailer not found or not assigned to you');
        }
        const updated = await this.prisma.retailer.update({
            where: { id: retailerId },
            data: dto,
        });
        await this.cacheManager.del(`retailers:sr:${salesRepId}:*`);
        return updated;
    }
};
exports.RetailerService = RetailerService;
exports.RetailerService = RetailerService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], RetailerService);
//# sourceMappingURL=retailer.service.js.map