import { GetAllTeamTimeOutput } from './dtos/get-all-team-times.dto';
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
  DefaultValuePipe,
  ParseIntPipe,
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

  @Get('/id')
  @ApiOperation({ summary: '특정 id의 팀을 받아온다' })
  async getTeamById(
    @Query() getTeamByIdQueryParameter: GetTeamByIdQueryParameter,
  ): Promise<GetTeamByIdOutput> {
    return await this.teamService.getTeamById(getTeamByIdQueryParameter);
  }

  @Get('/all-times')
  async getAllTeamTimes(): Promise<GetAllTeamTimeOutput> {
    return await this.teamService.getAllTimes();
  }

  @Get('/all/filter')
  @ApiOperation({ summary: '필터링된 팀들을 받아온다' })
  async getTeamsWithFilter(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query() getTeamsWithFilterInput?: GetTeamsWithFilterInput,
    @Query(
      'categoryIds',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    categoryIds?: string[],
    @Query(
      'times',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    times?: number[],
    @Query(
      'areaIds',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    areaIds?: string[],
  ): Promise<GetTeamsOutput> {
    console.log(categoryIds);
    return await this.teamService.getTeamsWithFilter(
      limit,
      page,
      getTeamsWithFilterInput,
      categoryIds,
      areaIds,
      times,
    );
  }
}
