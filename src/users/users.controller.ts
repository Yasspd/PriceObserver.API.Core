import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse()
  getCurrentUser(@CurrentUser() user: { userId: string }) {
    return this.usersService.getCurrentUser(user.userId);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update public profile fields' })
  @ApiOkResponse()
  updateProfile(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, dto);
  }

  @Patch('me/settings')
  @ApiOperation({ summary: 'Update notification-related settings' })
  @ApiOkResponse()
  updateSettings(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.usersService.updateSettings(user.userId, dto);
  }
}
