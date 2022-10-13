import { CreateTeamInput } from './../dtos/create-team.dto';
import { User } from './../../user/entities/user.entity';
import { MinMaxAge } from './../dtos/get-team-by-id.dto';
import { Category } from './../../category/entities/category.entity';
import { UserProfile } from '@user/entities/user-profile.entity';
import { TeamMetaData } from './../interfaces/teams-with-meta';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import * as moment from 'moment';
import { ApplicationStatus } from 'application/entities/application.entity';

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
  ): Promise<Team[]> {
    let teamQuery = await this.createQueryBuilder('team')
      .select('team.*')
      .addSelect('leader_profile.username', 'leader_username')
      .addSelect('leader_profile.profile_image_url', 'leader_image')
      .addSelect('category.name', 'category_name')
      .from(UserProfile, 'leader_profile')
      .addFrom(Category, 'category')
      .where('team.leader_id = leader_profile.fk_user_id')
      .andWhere('category_id = category.id');

    // .andWhere('team.season = 2');

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

    teamQuery.andWhere('team.is_closed = :isClosed', {
      isClosed: false,
    });

    teamQuery.orderBy('start_date', 'DESC');
    teamQuery.addOrderBy('name', 'ASC');
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
