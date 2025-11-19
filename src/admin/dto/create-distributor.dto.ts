import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDistributorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
