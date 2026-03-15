import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      throw new BadRequestException(
        `${metadata.data ?? 'value'} must be a valid integer`,
      );
    }

    return parsed;
  }
}
