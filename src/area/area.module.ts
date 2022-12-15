import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { AreaRepository } from './repositories/area.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AreaRepository])],
  providers: [AreaService],
  controllers: [AreaController],
})
export class AreaModule {}
