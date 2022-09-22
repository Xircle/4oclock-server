import { GetTeamsByCategoryInput } from './dtos/get-teams-by-category.dto';
import { CoreOutput } from './../common/common.interface';
import { GetTeamByIdInput, GetTeamByIdOutput } from './dtos/get-team-by-id.dto';
import { Controller, UseGuards, Get, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { TeamService } from './team.service';
import { GetTeamsOutput } from './dtos/get-teams.dto';

@ApiTags('Team')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get('/all')
  @ApiOperation({ summary: '모든 팀 정보' })
  async all(): Promise<GetTeamsOutput> {
    return await this.teamService.getTeams();
  }

  @Get('/id')
  @ApiOperation({ summary: '특정 id의 팀을 받아온다' })
  async getTeamById(
    @Body() getTeamByIdInput: GetTeamByIdInput,
  ): Promise<GetTeamByIdOutput> {
    return await this.teamService.getTeamById(getTeamByIdInput);
  }

  @Get('/all/category')
  @ApiOperation({ summary: '특정 카테고리의 팀을 받아온다' })
  async getTeamsByCategory(
    @Body() getTeamsByCategoryInput: GetTeamsByCategoryInput,
  ): Promise<GetTeamsOutput> {
    return await this.teamService.getTeamsByCategory(getTeamsByCategoryInput);
  }
}
