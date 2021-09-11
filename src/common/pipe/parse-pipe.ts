import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePipe implements PipeTransform {
  transform(value: any) {
    return JSON.parse(value);
  }
}
