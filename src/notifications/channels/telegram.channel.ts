import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramChannel {
  async send(payload: Record<string, unknown>) {
    return {
      channel: 'TELEGRAM',
      delivered: true,
      payload,
    };
  }
}
