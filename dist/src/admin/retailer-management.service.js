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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetailerManagementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
let RetailerManagementService = class RetailerManagementService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assignRetailers(dto) {
        const { salesRepId, retailerIds } = dto;
        const sr = await this.prisma.salesRep.findUnique({ where: { id: salesRepId } });
        if (!sr)
            throw new common_1.BadRequestException('Sales rep not found');
        const retailers = await this.prisma.retailer.findMany({
            where: { id: { in: retailerIds } },
        });
        if (retailers.length !== retailerIds.length) {
            throw new common_1.BadRequestException('Some retailers not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const assignments = retailerIds.map((retailerId) => ({
                salesRepId,
                retailerId,
            }));
            await tx.salesRepRetailer.createMany({
                data: assignments,
                skipDuplicates: true,
            });
            return { message: `Assigned ${retailerIds.length} retailers to SR ${salesRepId}` };
        });
    }
    async unassignRetailers(dto) {
        const { salesRepId, retailerIds } = dto;
        await this.prisma.salesRepRetailer.deleteMany({
            where: {
                salesRepId,
                retailerId: { in: retailerIds },
            },
        });
        return { message: `Unassigned ${retailerIds.length} retailers from SR ${salesRepId}` };
    }
    async importRetailersFromCSV(file) {
        const retailers = [];
        const stream = stream_1.Readable.from(file.buffer);
        return new Promise((resolve, reject) => {
            stream
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                retailers.push({
                    uid: row.uid,
                    name: row.name,
                    phone: row.phone || null,
                    regionId: parseInt(row.region_id),
                    areaId: parseInt(row.area_id),
                    distributorId: parseInt(row.distributor_id),
                    territoryId: parseInt(row.territory_id),
                    points: parseInt(row.points) || 0,
                    routes: row.routes || null,
                    notes: row.notes || null,
                });
            })
                .on('end', async () => {
                try {
                    const chunkSize = 1000;
                    let imported = 0;
                    for (let i = 0; i < retailers.length; i += chunkSize) {
                        const chunk = retailers.slice(i, i + chunkSize);
                        await this.prisma.retailer.createMany({
                            data: chunk,
                            skipDuplicates: true,
                        });
                        imported += chunk.length;
                    }
                    resolve({ message: `Imported ${imported} retailers`, total: retailers.length });
                }
                catch (error) {
                    reject(new common_1.BadRequestException(`Import failed: ${error.message}`));
                }
            })
                .on('error', (error) => {
                reject(new common_1.BadRequestException(`CSV parsing failed: ${error.message}`));
            });
        });
    }
};
exports.RetailerManagementService = RetailerManagementService;
exports.RetailerManagementService = RetailerManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RetailerManagementService);
//# sourceMappingURL=retailer-management.service.js.map