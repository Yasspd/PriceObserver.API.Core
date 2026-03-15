import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '../common/decorators/public.decorator';

@ApiTags('health')
@Public()
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({
    description: 'Simple liveness probe',
  })
  getHealth() {
    return {
      status: 'ok',
      service: 'PriceWatcher API',
      timestamp: new Date().toISOString(),
    };
  }
}
