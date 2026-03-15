import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SendTestNotificationDto } from './dto/send-test-notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List current user notifications' })
  @ApiOkResponse()
  getNotifications(@CurrentUser() user: { userId: string }) {
    return this.notificationsService.getUserNotifications(user.userId);
  }

  @Post('test')
  @ApiOperation({ summary: 'Send a test notification through a selected channel' })
  @ApiOkResponse()
  sendTestNotification(
    @CurrentUser() user: { userId: string },
    @Body() dto: SendTestNotificationDto,
  ) {
    return this.notificationsService.sendTestNotification(user.userId, dto);
  }
}
