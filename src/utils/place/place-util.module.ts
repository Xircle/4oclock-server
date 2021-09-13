import { Module } from '@nestjs/common';
import { PlaceUtilService } from './place-util.service';

@Module({
  providers: [PlaceUtilService],
})
export class PlaceUtilModule {}
