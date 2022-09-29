import { GetTeamsWithFilterInput } from './dtos/get-teams-with-filter.dto';
import { GetTeamsByCategoryInput } from './dtos/get-teams-by-category.dto';
import { CoreOutput } from './../common/common.interface';
import {
  GetTeamByIdInput,
  GetTeamByIdOutput,
  GetTeamByIdQueryParameter,
} from './dtos/get-team-by-id.dto';
import {
  Controller,
  UseGuards,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ParseArrayPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
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
import { string } from 'joi';

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
    @Query() getTeamByIdQueryParameter: GetTeamByIdQueryParameter,
  ): Promise<GetTeamByIdOutput> {
    return await this.teamService.getTeamById(getTeamByIdQueryParameter);
  }

  @Get('/all/category')
  @ApiOperation({ summary: '특정 카테고리의 팀을 받아온다' })
  async getTeamsByCategory(
    @Query('categoryId') categoryId: string,
  ): Promise<GetTeamsOutput> {
    return await this.teamService.getTeamsByCategory(categoryId);
  }

  @Get('/all/filter')
  @ApiOperation({ summary: '필터링된 팀들을 받아온다' })
  async getTeamsWithFilter(
    @Query() getTeamsWithFilterInput?: GetTeamsWithFilterInput,
    @Query(
      'categoryIds',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    categoryIds?: string[],
    @Query(
      'areaIds',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    areaIds?: string[],
  ): Promise<GetTeamsOutput> {
    console.log(categoryIds);
    return await this.teamService.getTeamsWithFilter(
      getTeamsWithFilterInput,
      categoryIds,
      areaIds,
    );
  }
}
