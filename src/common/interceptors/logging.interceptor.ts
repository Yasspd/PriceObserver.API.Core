import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request & { url: string }>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${request.url} completed in ${Date.now() - startedAt}ms`);
      }),
    );
  }
}
