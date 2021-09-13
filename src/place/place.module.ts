import { S3Service } from 'src/aws/s3/s3.service';
import { PlaceDetail } from './entities/place-detail.entity';
import { User } from './../user/entities/user.entity';
import { Place } from './entities/place.entity';
import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Place, PlaceDetail])],
  providers: [PlaceService, S3Service],
  controllers: [PlaceController],
})
export class PlaceModule {}
