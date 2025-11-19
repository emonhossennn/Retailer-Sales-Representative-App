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
exports.MasterDataController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const master_data_service_1 = require("./master-data.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const create_region_dto_1 = require("./dto/create-region.dto");
const create_area_dto_1 = require("./dto/create-area.dto");
const create_distributor_dto_1 = require("./dto/create-distributor.dto");
const create_territory_dto_1 = require("./dto/create-territory.dto");
let MasterDataController = class MasterDataController {
    masterDataService;
    constructor(masterDataService) {
        this.masterDataService = masterDataService;
    }
    createRegion(dto) {
        return this.masterDataService.createRegion(dto);
    }
    getRegions() {
        return this.masterDataService.getRegions();
    }
    updateRegion(id, dto) {
        return this.masterDataService.updateRegion(id, dto);
    }
    deleteRegion(id) {
        return this.masterDataService.deleteRegion(id);
    }
    createArea(dto) {
        return this.masterDataService.createArea(dto);
    }
    getAreas() {
        return this.masterDataService.getAreas();
    }
    updateArea(id, dto) {
        return this.masterDataService.updateArea(id, dto);
    }
    deleteArea(id) {
        return this.masterDataService.deleteArea(id);
    }
    createDistributor(dto) {
        return this.masterDataService.createDistributor(dto);
    }
    getDistributors() {
        return this.masterDataService.getDistributors();
    }
    updateDistributor(id, dto) {
        return this.masterDataService.updateDistributor(id, dto);
    }
    deleteDistributor(id) {
        return this.masterDataService.deleteDistributor(id);
    }
    createTerritory(dto) {
        return this.masterDataService.createTerritory(dto);
    }
    getTerritories() {
        return this.masterDataService.getTerritories();
    }
    updateTerritory(id, dto) {
        return this.masterDataService.updateTerritory(id, dto);
    }
    deleteTerritory(id) {
        return this.masterDataService.deleteTerritory(id);
    }
};
exports.MasterDataController = MasterDataController;
__decorate([
    (0, common_1.Post)('regions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create region (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_region_dto_1.CreateRegionDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "createRegion", null);
__decorate([
    (0, common_1.Get)('regions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all regions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getRegions", null);
__decorate([
    (0, common_1.Put)('regions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update region (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_region_dto_1.CreateRegionDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "updateRegion", null);
__decorate([
    (0, common_1.Delete)('regions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete region (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "deleteRegion", null);
__decorate([
    (0, common_1.Post)('areas'),
    (0, swagger_1.ApiOperation)({ summary: 'Create area (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_area_dto_1.CreateAreaDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "createArea", null);
__decorate([
    (0, common_1.Get)('areas'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all areas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getAreas", null);
__decorate([
    (0, common_1.Put)('areas/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update area (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_area_dto_1.CreateAreaDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "updateArea", null);
__decorate([
    (0, common_1.Delete)('areas/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete area (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "deleteArea", null);
__decorate([
    (0, common_1.Post)('distributors'),
    (0, swagger_1.ApiOperation)({ summary: 'Create distributor (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_distributor_dto_1.CreateDistributorDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "createDistributor", null);
__decorate([
    (0, common_1.Get)('distributors'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all distributors' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getDistributors", null);
__decorate([
    (0, common_1.Put)('distributors/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update distributor (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_distributor_dto_1.CreateDistributorDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "updateDistributor", null);
__decorate([
    (0, common_1.Delete)('distributors/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete distributor (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "deleteDistributor", null);
__decorate([
    (0, common_1.Post)('territories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create territory (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_territory_dto_1.CreateTerritoryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "createTerritory", null);
__decorate([
    (0, common_1.Get)('territories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all territories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getTerritories", null);
__decorate([
    (0, common_1.Put)('territories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update territory (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_territory_dto_1.CreateTerritoryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "updateTerritory", null);
__decorate([
    (0, common_1.Delete)('territories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete territory (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "deleteTerritory", null);
exports.MasterDataController = MasterDataController = __decorate([
    (0, swagger_1.ApiTags)('admin/master-data'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN),
    (0, common_1.Controller)('admin/master-data'),
    __metadata("design:paramtypes", [master_data_service_1.MasterDataService])
], MasterDataController);
//# sourceMappingURL=master-data.controller.js.map