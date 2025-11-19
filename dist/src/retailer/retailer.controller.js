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
exports.RetailerController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const retailer_service_1 = require("./retailer.service");
const retailer_query_dto_1 = require("./dto/retailer-query.dto");
const update_retailer_dto_1 = require("./dto/update-retailer.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let RetailerController = class RetailerController {
    retailerService;
    constructor(retailerService) {
        this.retailerService = retailerService;
    }
    async getRetailers(user, query) {
        return this.retailerService.getRetailersForSR(user.id, query);
    }
    async getRetailerDetails(user, id) {
        return this.retailerService.getRetailerDetails(id, user.id);
    }
    async updateRetailer(user, id, dto) {
        return this.retailerService.updateRetailer(id, user.id, dto);
    }
};
exports.RetailerController = RetailerController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get retailers assigned to current SR' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, retailer_query_dto_1.RetailerQueryDto]),
    __metadata("design:returntype", Promise)
], RetailerController.prototype, "getRetailers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get retailer details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], RetailerController.prototype, "getRetailerDetails", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update retailer fields (points, routes, notes)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_retailer_dto_1.UpdateRetailerDto]),
    __metadata("design:returntype", Promise)
], RetailerController.prototype, "updateRetailer", null);
exports.RetailerController = RetailerController = __decorate([
    (0, swagger_1.ApiTags)('retailers'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('retailers'),
    __metadata("design:paramtypes", [retailer_service_1.RetailerService])
], RetailerController);
//# sourceMappingURL=retailer.controller.js.map