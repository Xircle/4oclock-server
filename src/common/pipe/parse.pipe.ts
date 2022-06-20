import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePipe implements PipeTransform {
  transform(value: any) {
    return JSON.parse(JSON.stringify(value));
  }
}
