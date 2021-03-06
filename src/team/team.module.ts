import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamRepository } from './repository/team.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository, Team])],

  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
