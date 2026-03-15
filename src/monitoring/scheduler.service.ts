import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { MonitoringService } from './monitoring.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  handleScheduledSweep() {
    return this.monitoringService.enqueueScheduledSweep();
  }
}
