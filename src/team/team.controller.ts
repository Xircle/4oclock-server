import { GetTeamApplicationsOutput } from './dtos/get-team-applications';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTeamInput, TeamPhotoInput } from './dtos/create-team.dto';
import { User } from './../user/entities/user.entity';
import { CoreOutput } from './../common/common.interface';
import { GetAllTeamTimeOutput } from './dtos/get-all-team-times.dto';
import {
  GetTeamByIdOutput,
  GetTeamByIdQueryParameter,
  MinMaxAge,
} from './dtos/get-team-by-id.dto';
import {
  Controller,
  Get,
  Query,
  ParseArrayPipe,
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
  Body,
  UploadedFiles,
  UseInterceptors,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { TeamService } from './team.service';
import { GetTeamsOutput, GetTeamsNotPagination } from './dtos/get-teams.dto';
import { GetUser } from '@auth/decorators/get-user.decorator';

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
    @Query(
      'ages',
      new ParseArrayPipe({ items: MinMaxAge, separator: ',', optional: true }),
    )
    ages: MinMaxAge[],
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
    return await this.teamService.getTeamsWithFilter(
      limit,
      page,
      ages,
      categoryIds,
      areaIds,
      times,
    );
  }
  @Get('/all')
  @ApiOperation({ summary: '모든' })
  async getTeams(): Promise<GetTeamsNotPagination> {
    return await this.teamService.getAllTeams();
  }

  @Get('/crew-applications')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '리더 승인 페이지' })
  async getTeamApplicationsForLeader(
    @GetUser() authUser: User,
    @Query('teamId', ParseIntPipe) teamId: number,
  ): Promise<GetTeamApplicationsOutput> {
    return await this.teamService.getTeamApplicationsForLeader(
      authUser,
      teamId,
    );
  }

  @Post('/create')
  @ApiOperation({ summary: '팀 생성' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'images',
        maxCount: 16,
      },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  async createTeam(
    @GetUser() authUser: User,
    @Body() createTeamInput: CreateTeamInput,
    @UploadedFiles() files: TeamPhotoInput,
  ): Promise<CoreOutput> {
    return this.teamService.createTeam(authUser, createTeamInput, files);
  }
}
