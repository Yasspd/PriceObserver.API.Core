import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../common/decorators/public.decorator';
import { PlansService } from './plans.service';

@ApiTags('plans')
@Public()
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'List available subscription plans' })
  @ApiOkResponse()
  getPlans() {
    return this.plansService.getPlans();
  }
}
