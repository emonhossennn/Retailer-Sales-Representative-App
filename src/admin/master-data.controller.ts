import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MasterDataService } from './master-data.service';
import { Roles, Role } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateRegionDto } from './dto/create-region.dto';
import { CreateAreaDto } from './dto/create-area.dto';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { CreateTerritoryDto } from './dto/create-territory.dto';

@ApiTags('admin/master-data')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin/master-data')
export class MasterDataController {
  constructor(private masterDataService: MasterDataService) {}

  // Regions
  @Post('regions')
  @ApiOperation({ summary: 'Create region (Admin only)' })
  createRegion(@Body() dto: CreateRegionDto) {
    return this.masterDataService.createRegion(dto);
  }

  @Get('regions')
  @ApiOperation({ summary: 'Get all regions' })
  getRegions() {
    return this.masterDataService.getRegions();
  }

  @Put('regions/:id')
  @ApiOperation({ summary: 'Update region (Admin only)' })
  updateRegion(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateRegionDto) {
    return this.masterDataService.updateRegion(id, dto);
  }

  @Delete('regions/:id')
  @ApiOperation({ summary: 'Delete region (Admin only)' })
  deleteRegion(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deleteRegion(id);
  }

  // Areas
  @Post('areas')
  @ApiOperation({ summary: 'Create area (Admin only)' })
  createArea(@Body() dto: CreateAreaDto) {
    return this.masterDataService.createArea(dto);
  }

  @Get('areas')
  @ApiOperation({ summary: 'Get all areas' })
  getAreas() {
    return this.masterDataService.getAreas();
  }

  @Put('areas/:id')
  @ApiOperation({ summary: 'Update area (Admin only)' })
  updateArea(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAreaDto) {
    return this.masterDataService.updateArea(id, dto);
  }

  @Delete('areas/:id')
  @ApiOperation({ summary: 'Delete area (Admin only)' })
  deleteArea(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deleteArea(id);
  }

  // Distributors
  @Post('distributors')
  @ApiOperation({ summary: 'Create distributor (Admin only)' })
  createDistributor(@Body() dto: CreateDistributorDto) {
    return this.masterDataService.createDistributor(dto);
  }

  @Get('distributors')
  @ApiOperation({ summary: 'Get all distributors' })
  getDistributors() {
    return this.masterDataService.getDistributors();
  }

  @Put('distributors/:id')
  @ApiOperation({ summary: 'Update distributor (Admin only)' })
  updateDistributor(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateDistributorDto) {
    return this.masterDataService.updateDistributor(id, dto);
  }

  @Delete('distributors/:id')
  @ApiOperation({ summary: 'Delete distributor (Admin only)' })
  deleteDistributor(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deleteDistributor(id);
  }

  // Territories
  @Post('territories')
  @ApiOperation({ summary: 'Create territory (Admin only)' })
  createTerritory(@Body() dto: CreateTerritoryDto) {
    return this.masterDataService.createTerritory(dto);
  }

  @Get('territories')
  @ApiOperation({ summary: 'Get all territories' })
  getTerritories() {
    return this.masterDataService.getTerritories();
  }

  @Put('territories/:id')
  @ApiOperation({ summary: 'Update territory (Admin only)' })
  updateTerritory(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateTerritoryDto) {
    return this.masterDataService.updateTerritory(id, dto);
  }

  @Delete('territories/:id')
  @ApiOperation({ summary: 'Delete territory (Admin only)' })
  deleteTerritory(@Param('id', ParseIntPipe) id: number) {
    return this.masterDataService.deleteTerritory(id);
  }
}
