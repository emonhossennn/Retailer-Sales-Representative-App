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
exports.RetailerManagementController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const retailer_management_service_1 = require("./retailer-management.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const assign_retailers_dto_1 = require("./dto/assign-retailers.dto");
let RetailerManagementController = class RetailerManagementController {
    retailerManagementService;
    constructor(retailerManagementService) {
        this.retailerManagementService = retailerManagementService;
    }
    assignRetailers(dto) {
        return this.retailerManagementService.assignRetailers(dto);
    }
    unassignRetailers(dto) {
        return this.retailerManagementService.unassignRetailers(dto);
    }
    importRetailers(file) {
        return this.retailerManagementService.importRetailersFromCSV(file);
    }
};
exports.RetailerManagementController = RetailerManagementController;
__decorate([
    (0, common_1.Post)('assign'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk assign retailers to SR (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_retailers_dto_1.AssignRetailersDto]),
    __metadata("design:returntype", void 0)
], RetailerManagementController.prototype, "assignRetailers", null);
__decorate([
    (0, common_1.Delete)('unassign'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk unassign retailers from SR (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [assign_retailers_dto_1.AssignRetailersDto]),
    __metadata("design:returntype", void 0)
], RetailerManagementController.prototype, "unassignRetailers", null);
__decorate([
    (0, common_1.Post)('import-csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Import retailers from CSV (Admin only)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RetailerManagementController.prototype, "importRetailers", null);
exports.RetailerManagementController = RetailerManagementController = __decorate([
    (0, swagger_1.ApiTags)('admin/retailer-management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_decorator_1.Role.ADMIN),
    (0, common_1.Controller)('admin/retailer-management'),
    __metadata("design:paramtypes", [retailer_management_service_1.RetailerManagementService])
], RetailerManagementController);
//# sourceMappingURL=retailer-management.controller.js.map