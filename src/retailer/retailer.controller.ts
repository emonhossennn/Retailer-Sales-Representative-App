import { Controller, Get, Patch, Param, Query, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RetailerService } from './retailer.service';
import { RetailerQueryDto } from './dto/retailer-query.dto';
import { UpdateRetailerDto } from './dto/update-retailer.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('retailers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('retailers')
export class RetailerController {
  constructor(private retailerService: RetailerService) {}

  @Get()
  @ApiOperation({ summary: 'Get retailers assigned to current SR' })
  async getRetailers(@CurrentUser() user: any, @Query() query: RetailerQueryDto) {
    return this.retailerService.getRetailersForSR(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get retailer details' })
  async getRetailerDetails(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.retailerService.getRetailerDetails(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update retailer fields (points, routes, notes)' })
  async updateRetailer(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRetailerDto,
  ) {
    return this.retailerService.updateRetailer(id, user.id, dto);
  }
}
