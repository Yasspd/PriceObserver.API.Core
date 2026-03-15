import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ManualCheckDto } from './dto/manual-check.dto';
import { PricingService } from './pricing.service';

@ApiTags('pricing')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('manual-check')
  @ApiOperation({ summary: 'Store a manual price snapshot and evaluate rules' })
  @ApiOkResponse()
  manualCheck(
    @CurrentUser() user: { userId: string },
    @Body() dto: ManualCheckDto,
  ) {
    return this.pricingService.manualCheck(user.userId, dto);
  }
}
