import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhookChannel {
  async send(payload: Record<string, unknown>) {
    return {
      channel: 'WEBHOOK',
      delivered: true,
      payload,
    };
  }
}
