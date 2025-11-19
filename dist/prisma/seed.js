"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.salesRep.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            name: 'Admin User',
            phone: '+8801700000000',
            passwordHash: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log('Created admin:', admin.username);
    const srPassword = await bcrypt.hash('sr123', 10);
    const sr = await prisma.salesRep.upsert({
        where: { username: 'sr1' },
        update: {},
        create: {
            username: 'sr1',
            name: 'Sales Rep 1',
            phone: '+8801700000001',
            passwordHash: srPassword,
            role: 'SALES_REP',
        },
    });
    console.log('Created sales rep:', sr.username);
    const dhaka = await prisma.region.upsert({
        where: { name: 'Dhaka' },
        update: {},
        create: { name: 'Dhaka' },
    });
    const chittagong = await prisma.region.upsert({
        where: { name: 'Chittagong' },
        update: {},
        create: { name: 'Chittagong' },
    });
    console.log('Created regions');
    const dhanmondi = await prisma.area.upsert({
        where: { name_regionId: { name: 'Dhanmondi', regionId: dhaka.id } },
        update: {},
        create: { name: 'Dhanmondi', regionId: dhaka.id },
    });
    const gulshan = await prisma.area.upsert({
        where: { name_regionId: { name: 'Gulshan', regionId: dhaka.id } },
        update: {},
        create: { name: 'Gulshan', regionId: dhaka.id },
    });
    console.log('Created areas');
    const dist1 = await prisma.distributor.upsert({
        where: { name: 'Distributor A' },
        update: {},
        create: { name: 'Distributor A' },
    });
    const dist2 = await prisma.distributor.upsert({
        where: { name: 'Distributor B' },
        update: {},
        create: { name: 'Distributor B' },
    });
    console.log('Created distributors');
    const terr1 = await prisma.territory.upsert({
        where: { name_areaId: { name: 'Territory 1', areaId: dhanmondi.id } },
        update: {},
        create: { name: 'Territory 1', areaId: dhanmondi.id },
    });
    const terr2 = await prisma.territory.upsert({
        where: { name_areaId: { name: 'Territory 2', areaId: gulshan.id } },
        update: {},
        create: { name: 'Territory 2', areaId: gulshan.id },
    });
    console.log('Created territories');
    const retailers = [];
    for (let i = 1; i <= 10; i++) {
        const retailer = await prisma.retailer.upsert({
            where: { uid: `R${String(i).padStart(4, '0')}` },
            update: {},
            create: {
                uid: `R${String(i).padStart(4, '0')}`,
                name: `Retailer ${i}`,
                phone: `+88017000000${String(i).padStart(2, '0')}`,
                regionId: i % 2 === 0 ? dhaka.id : chittagong.id,
                areaId: i % 2 === 0 ? dhanmondi.id : gulshan.id,
                distributorId: i % 2 === 0 ? dist1.id : dist2.id,
                territoryId: i % 2 === 0 ? terr1.id : terr2.id,
                points: i * 10,
                routes: `Route ${i}`,
                notes: `Sample notes for retailer ${i}`,
            },
        });
        retailers.push(retailer);
    }
    console.log('Created 10 sample retailers');
    for (let i = 0; i < 5; i++) {
        await prisma.salesRepRetailer.upsert({
            where: {
                salesRepId_retailerId: {
                    salesRepId: sr.id,
                    retailerId: retailers[i].id,
                },
            },
            update: {},
            create: {
                salesRepId: sr.id,
                retailerId: retailers[i].id,
            },
        });
    }
    console.log('Assigned 5 retailers to SR');
    console.log('\nSeeding completed!');
    console.log('\nLogin credentials:');
    console.log('Admin - username: admin, password: admin123');
    console.log('Sales Rep - username: sr1, password: sr123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map