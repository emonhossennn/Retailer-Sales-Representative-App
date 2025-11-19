import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
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

  // Create sales rep
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

  // Create regions
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

  // Create areas
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

  // Create distributors
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

  // Create territories
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

  // Create sample retailers
  const retailers: Array<{ id: number }> = [];
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

  // Assign first 5 retailers to SR
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
