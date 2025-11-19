import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignRetailersDto } from './dto/assign-retailers.dto';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class RetailerManagementService {
  constructor(private prisma: PrismaService) {}

  async assignRetailers(dto: AssignRetailersDto) {
    const { salesRepId, retailerIds } = dto;

    // Verify SR exists
    const sr = await this.prisma.salesRep.findUnique({ where: { id: salesRepId } });
    if (!sr) throw new BadRequestException('Sales rep not found');

    // Verify retailers exist
    const retailers = await this.prisma.retailer.findMany({
      where: { id: { in: retailerIds } },
    });
    if (retailers.length !== retailerIds.length) {
      throw new BadRequestException('Some retailers not found');
    }

    // Bulk assign using transaction
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

  async unassignRetailers(dto: AssignRetailersDto) {
    const { salesRepId, retailerIds } = dto;

    await this.prisma.salesRepRetailer.deleteMany({
      where: {
        salesRepId,
        retailerId: { in: retailerIds },
      },
    });

    return { message: `Unassigned ${retailerIds.length} retailers from SR ${salesRepId}` };
  }

  async importRetailersFromCSV(file: any) {
    const retailers: Array<{
      uid: string;
      name: string;
      phone: string | null;
      regionId: number;
      areaId: number;
      distributorId: number;
      territoryId: number;
      points: number;
      routes: string | null;
      notes: string | null;
    }> = [];
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
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
            // Batch insert in chunks of 1000
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
          } catch (error) {
            reject(new BadRequestException(`Import failed: ${error.message}`));
          }
        })
        .on('error', (error) => {
          reject(new BadRequestException(`CSV parsing failed: ${error.message}`));
        });
    });
  }
}
