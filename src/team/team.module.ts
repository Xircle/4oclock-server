import { UserProfileRepository } from './../user/repositories/user-profile.repository';
import { AuthModule } from './../auth/auth.module';
import { S3Service } from './../aws/s3/s3.service';
import { UserRepository } from './../user/repositories/user.repository';
import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamRepository } from './repository/team.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeamRepository,
      Team,
      UserRepository,
      UserProfileRepository,
    ]),
    AuthModule,
  ],

  providers: [TeamService, S3Service],
  controllers: [TeamController],
})
export class TeamModule {}
