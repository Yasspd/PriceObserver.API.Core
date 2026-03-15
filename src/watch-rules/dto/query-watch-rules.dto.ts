import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { WatchTriggerType } from '../../common/constants/trigger-type.enum';
import { PaginatedQueryDto } from '../../common/dto/paginated-query.dto';

const RULE_STATUSES = ['ACTIVE', 'PAUSED', 'EXPIRED', 'COMPLETED'] as const;

export class QueryWatchRulesDto extends PaginatedQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({
    enum: WatchTriggerType,
  })
  @IsOptional()
  @IsString()
  triggerType?: WatchTriggerType;

  @ApiPropertyOptional({
    enum: RULE_STATUSES,
  })
  @IsOptional()
  @IsIn(RULE_STATUSES)
  status?: (typeof RULE_STATUSES)[number];
}
