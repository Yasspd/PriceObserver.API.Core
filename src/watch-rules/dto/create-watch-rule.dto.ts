import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { NotificationChannel } from '../../common/constants/notification-channel.enum';
import { WatchTriggerType } from '../../common/constants/trigger-type.enum';

export class CreateWatchRuleDto {
  @ApiProperty()
  @IsString()
  productId!: string;

  @ApiProperty({
    enum: WatchTriggerType,
  })
  @IsEnum(WatchTriggerType)
  triggerType!: WatchTriggerType;

  @ApiPropertyOptional({
    enum: NotificationChannel,
    default: NotificationChannel.EMAIL,
  })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  thresholdPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  percentDrop?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  onlyOnce?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cooldownHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxNotifications?: number;
}
