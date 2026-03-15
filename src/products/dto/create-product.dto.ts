import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  title!: string;

  @ApiProperty()
  @IsUrl()
  url!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional({
    default: 'mock',
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string;
}
