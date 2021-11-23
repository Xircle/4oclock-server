import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { RolesGuard } from '@auth/guard/roles.guard';
import { Roles } from '@auth/roles.decorator';
import { CoreOutput } from '@common/common.interface';
import { VerifyAdminInput } from './dtos/verify-admin.dto';
import { AdminService } from './admin.service';
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['Admin'])
  async verifyAdmin(
    @Body() verifyAdminInput: VerifyAdminInput,
  ): Promise<CoreOutput> {
    return this.adminService.verifyAdmin(verifyAdminInput);
  }
}
