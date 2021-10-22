import { RolesGuard } from './../auth/guard/roles.guard';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { CoreOutput } from 'src/common/common.interface';
import { VerifyAdminInput } from './dtos/verify-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(['Admin'])
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('verify')
  async verifyAdmin(
    @Body() verifyAdminInput: VerifyAdminInput,
  ): Promise<CoreOutput> {
    return this.adminService.verifyAdmin(verifyAdminInput);
  }
}
