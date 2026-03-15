import { Injectable } from '@nestjs/common';

import { addHours } from '../../common/utils/date.util';

@Injectable()
export class CooldownPolicy {
  canNotify(lastNotifiedAt?: Date | null, cooldownHours?: number | null): boolean {
    if (!lastNotifiedAt || !cooldownHours) {
      return true;
    }

    return addHours(lastNotifiedAt, cooldownHours).getTime() <= Date.now();
  }
}
