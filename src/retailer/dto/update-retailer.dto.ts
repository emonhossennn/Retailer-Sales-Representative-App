import { IsOptional, IsInt, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRetailerDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  points?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  routes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
