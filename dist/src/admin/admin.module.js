"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const master_data_controller_1 = require("./master-data.controller");
const master_data_service_1 = require("./master-data.service");
const retailer_management_controller_1 = require("./retailer-management.controller");
const retailer_management_service_1 = require("./retailer-management.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        controllers: [master_data_controller_1.MasterDataController, retailer_management_controller_1.RetailerManagementController],
        providers: [master_data_service_1.MasterDataService, retailer_management_service_1.RetailerManagementService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map