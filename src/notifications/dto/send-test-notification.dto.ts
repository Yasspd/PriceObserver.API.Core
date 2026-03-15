import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

import { NotificationChannel } from '../../common/constants/notification-channel.enum';

export class SendTestNotificationDto {
  @ApiProperty({
    enum: NotificationChannel,
  })
  @IsEnum(NotificationChannel)
  channel!: NotificationChannel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telegramChatId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  webhookUrl?: string;

  @ApiPropertyOptional({
    default: 'Test notification from PriceWatcher API',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
