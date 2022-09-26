import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';

@Module({
  providers: [AreaService],
  controllers: [AreaController]
})
export class AreaModule {}
