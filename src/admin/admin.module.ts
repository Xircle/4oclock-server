import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [AuthModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
