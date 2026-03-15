import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

export class QueryProductsDto extends PaginatedQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
