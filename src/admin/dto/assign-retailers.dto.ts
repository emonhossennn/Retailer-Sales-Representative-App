import { IsInt, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRetailersDto {
  @ApiProperty()
  @IsInt()
  salesRepId: number;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  retailerIds: number[];
}
