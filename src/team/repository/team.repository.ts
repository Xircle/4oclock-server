import { TeamData } from './../dtos/get-teams.dto';
import { CreateTeamInput } from './../dtos/create-team.dto';
import { MinMaxAge } from './../dtos/get-team-by-id.dto';
import { Category } from './../../category/entities/category.entity';
import { UserProfile } from '@user/entities/user-profile.entity';
import { TeamMetaData } from './../interfaces/teams-with-meta';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import * as moment from 'moment';
import {
  Application,
  ApplicationStatus,
} from 'application/entities/application.entity';

export class FindManyTeamsV2Input {}

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  public async findManyTeams(season = 1): Promise<Team[]> {
    return this.find({
      where: { season: season },
      order: {
        id: 'ASC',
      },
    });
  }

  public async findManyTeamsV2(
    findManyTeamsV2Input: FindManyTeamsV2Input,
  ): Promise<Team[]> {
    return [];
  }

  public async closeTeamsWithBL() {
    const teams: Team[] = await this.find({ relations: ['applications'] });

    teams.map((team) => {
      let count = 0;
      team.applications.map((application) => {
        if (application.status === ApplicationStatus.Approved) {
          count++;
        }
      });
      if (team.isClosed) {
        if (
          (!team.startDate || team.startDate >= moment().toDate()) &&
          count < team.maxParticipant
        ) {
          this.update({ id: team.id }, { isClosed: false });
        }
      } else {
        if (
          (team.startDate && team.startDate < moment().toDate()) ||
          count >= team.maxParticipant
        ) {
          this.update({ id: team.id }, { isClosed: true });
        }
      }
    });
  }

  public async findTeamsWithFilter(
    limit: number,
    page: number,
    ages?: MinMaxAge[],
    categoryIds?: string[],
    areaIds?: string[],
    times?: number[],
  ): Promise<TeamData[]> {
    let teamQuery = await this.createQueryBuilder('team')
      .select('team.*')
      .addSelect('team.max_participant', 'maxParticipant')
      .addSelect('leader_profile.username', 'leader_username')
      .addSelect('count(application)', 'applyCount')
      .addSelect(
        "count(case when application.status = 'Approved' then 1 else null end)",
        'approveCount',
      )
      .addSelect('leader_profile.profile_image_url', 'leader_image')
      .addSelect('category.name', 'category_name')
      .from(UserProfile, 'leader_profile')
      .addFrom(Category, 'category')
      .addFrom(Application, 'application')
      .where('team.leader_id = leader_profile.fk_user_id')
      .andWhere('category_id = category.id')
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere('application.team_id = team.id').orWhere(
            'team.id is not null',
          );
        }),
      );
    teamQuery.andWhere(
      new Brackets((qb) => {
        ages.forEach((item, idx) => {
          qb.orWhere(
            new Brackets((qb2) => {
              qb2
                .andWhere('min_age >= :minAge' + idx, {
                  ['minAge' + idx]: item.minAge,
                })
                .andWhere('max_age <= :maxAge' + idx, {
                  ['maxAge' + idx]: item.maxAge,
                });
            }),
          );
        });
      }),
    );

    if (categoryIds) {
      teamQuery.andWhere('category_id in (:...categoryIds)', {
        categoryIds: categoryIds,
      });
    }

    if (times) {
      teamQuery.andWhere(`meeting_day in (:...meetingDay)`, {
        meetingDay: times,
      });
    }
    if (ages?.length > 0) {
      teamQuery.andWhere(
        new Brackets((qb) => {
          ages.forEach((item, idx) => {
            qb.orWhere(
              new Brackets((qb2) => {
                qb2
                  .andWhere('min_age >= :minAge' + idx, {
                    ['minAge' + idx]: item.minAge,
                  })
                  .andWhere('max_age <= :maxAge' + idx, {
                    ['maxAge' + idx]: item.maxAge,
                  });
              }),
            );
          });
        }),
      );
    }

    if (areaIds?.length > 0) {
      teamQuery.andWhere('area_id in (:...areaIds)', { areaIds: areaIds });
    }
    teamQuery.distinct();
    teamQuery.groupBy('team.id');
    teamQuery.addGroupBy('leader_profile.id');
    teamQuery.addGroupBy('category.id');
    teamQuery.orderBy('team.is_closed', 'ASC');
    teamQuery.addOrderBy('team.start_date', 'DESC');
    teamQuery.addOrderBy('team.name', 'ASC');
    teamQuery.take(limit).skip(page * limit);

    return teamQuery.getRawMany();
  }
  public async getTeamMetaData(
    page: number,
    limit: number,
    ages?: MinMaxAge[],
    categoryIds?: string[],
    areaIds?: string[],
  ): Promise<TeamMetaData> {
    let totalItems = await this.count({});
    totalItems = totalItems > 100 ? 100 : totalItems;
    const totalPages = Math.floor(totalItems / limit) + 1;
    return {
      totalPages,
      page,
    };
  }

  public async getMyTeamsLeader(userId: string) {
    //await this.
  }

  public async getAllTimes() {
    const times = await this.createQueryBuilder('team')
      .distinctOn(['meeting_day', 'meeting_hour', 'meeting_minute'])
      .select('meeting_day', 'meetingDay')
      .addSelect('meeting_hour', 'meetingHour')
      .addSelect('meeting_minute', 'meetingMinute')
      .where({
        isClosed: false,
      })
      .getRawMany();
    return times;
  }

  // authUser로 리더 판명은 나중에
  public async findByTeamId(teamId: number) {
    const team = await this.createQueryBuilder('team')
      .where('team.id = :teamId', { teamId: teamId })
      .getOne();

    return team;
  }

  public async createTeam(
    leaderId: string,
    createTeamInput: CreateTeamInput,
    imageUrls: string[],
  ) {
    const {
      name,
      season,
      areaInfo,
      question,
      description,
      maxParticipant,
      minAge,
      maxAge,
      meetingDay,
      meetingHour,
      meetingMinute,
      category_id,
    } = createTeamInput;
    const newTeam = this.create({
      name,
      season,
      area_info: areaInfo,
      question,
      description,
      maxParticipant,
      minAge,
      maxAge,
      meetingDay,
      meetingHour,
      meetingMinute,
      category_id,
      leader_id: leaderId,
      images: imageUrls,
    });
    await this.save(newTeam);
  }
}
