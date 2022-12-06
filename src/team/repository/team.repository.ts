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
import { season } from 'libs/sharedData';

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
      .addSelect('count(application.*)', 'applyCount')
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
      .andWhere('application.team_id = team.id')
      .andWhere('team.season = :season', { season: season });

    if (categoryIds && categoryIds.length > 0) {
      teamQuery.andWhere('category_id in (:...categoryIds)', {
        categoryIds: categoryIds,
      });
    }

    if (times && times.length > 0) {
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
                  .andWhere(
                    '(male_min_age IS NULL or male_min_age = :maleMinAge' +
                      idx +
                      ')',
                    {
                      ['maleMinAge' + idx]: item.maleMinAge,
                    },
                  )
                  .andWhere(
                    '(male_max_age IS NULL or male_max_age = :maleMaxAge' +
                      idx +
                      ')',
                    {
                      ['maleMaxAge' + idx]: item.maleMaxAge,
                    },
                  )
                  .andWhere(
                    '(female_min_age IS NULL or female_min_age = :femaleMinAge' +
                      idx +
                      ')',
                    {
                      ['femaleMinAge' + idx]: item.femaleMinAge,
                    },
                  )
                  .andWhere(
                    '(female_max_age IS NULL or female_max_age = :femaleMaxAge' +
                      idx +
                      ')',
                    {
                      ['femaleMaxAge' + idx]: item.femaleMaxAge,
                    },
                  );
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
    teamQuery.orderBy(
      "count(case when application.status = 'Approved' then 1 else null end)",
      'ASC',
    );
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
        season: season,
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
      maleMinAge,
      maleMaxAge,
      femaleMinAge,
      femaleMaxAge,
      meetingDay,
      meetingHour,
      meetingMinute,
      category_id,
      leaderIntro,
    } = createTeamInput;
    const newTeam = this.create({
      name,
      season,
      area_info: areaInfo,
      question,
      description,
      maxParticipant,
      maleMinAge,
      maleMaxAge,
      femaleMinAge,
      femaleMaxAge,
      meetingDay,
      meetingHour,
      meetingMinute,
      category_id,
      leader_id: leaderId,
      images: imageUrls,
      leaderIntro,
    });
    await this.save(newTeam);
  }
}
