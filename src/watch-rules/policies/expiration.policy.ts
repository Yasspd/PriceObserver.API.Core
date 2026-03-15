import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpirationPolicy {
  isExpired(expiresAt?: Date | null): boolean {
    return !!expiresAt && expiresAt.getTime() <= Date.now();
  }
}
