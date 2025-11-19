import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { RetailerManagementService } from './retailer-management.service';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AssignRetailersDto } from './dto/assign-retailers.dto';

@ApiTags('admin/retailer-management')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/retailer-management')
export class RetailerManagementController {
  constructor(private retailerManagementService: RetailerManagementService) {}

  @Post('assign')
  @ApiOperation({ summary: 'Bulk assign retailers to SR (Admin only)' })
  assignRetailers(@Body() dto: AssignRetailersDto) {
    return this.retailerManagementService.assignRetailers(dto);
  }

  @Delete('unassign')
  @ApiOperation({ summary: 'Bulk unassign retailers from SR (Admin only)' })
  unassignRetailers(@Body() dto: AssignRetailersDto) {
    return this.retailerManagementService.unassignRetailers(dto);
  }

  @Post('import-csv')
  @ApiOperation({ summary: 'Import retailers from CSV (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  importRetailers(@UploadedFile() file: any) {
    return this.retailerManagementService.importRetailersFromCSV(file);
  }
}
