import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailChannel {
  async send(payload: Record<string, unknown>) {
    return {
      channel: 'EMAIL',
      delivered: true,
      payload,
    };
  }
}
