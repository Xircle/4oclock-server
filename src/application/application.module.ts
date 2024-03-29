import { UserRepository } from '@user/repositories/user.repository';
import { TeamRepository } from './../team/repository/team.repository';
import { AuthModule } from './../auth/auth.module';
import { ApplicationRepository } from './repositories/application.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ApplicationRepository,
      TeamRepository,
      UserRepository,
    ]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
