import { TeamMetaData } from './../interfaces/teams-with-meta';
import { UserRepository } from './../../user/repositories/user.repository';
import { GetTeamsWithFilterInput } from './../dtos/get-teams-with-filter.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Team } from '../entities/team.entity';

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

  public async findTeamsWithFilter(
    limit: number,
    page: number,
    getTeamsWithFilterInput?: GetTeamsWithFilterInput,
    categoryIds?: string[],
    areaIds?: string[],
  ): Promise<Team[]> {
    let teamQuery = await this.createQueryBuilder();

    if (categoryIds?.length > 0) {
      teamQuery.andWhere('category_id in (:...categoryIds)', {
        categoryIds: categoryIds,
      });
    }

    if (getTeamsWithFilterInput?.minAge) {
      teamQuery.andWhere('min_age <= :minAge', {
        minAge: getTeamsWithFilterInput.minAge,
      });
    }

    if (getTeamsWithFilterInput?.maxAge) {
      teamQuery.andWhere('max_age >= :maxAge', {
        maxAge: getTeamsWithFilterInput.maxAge,
      });
    }

    if (areaIds?.length > 0) {
      teamQuery.andWhere('area_id in (:...areaIds)', { areaIds: areaIds });
    }

    teamQuery.orderBy('start_date', 'DESC');
    teamQuery.andWhere('is_closed = :isClosed', {
      isClosed: false,
    });
    teamQuery.take(limit).skip(page * limit);

    return teamQuery.getMany();
  }
  public async getTeamMetaData(
    page: number,
    limit: number,
  ): Promise<TeamMetaData> {
    let totalItems = await this.count();
    totalItems = totalItems > 100 ? 100 : totalItems;
    const totalPages = Math.floor(totalItems / limit);
    return {
      totalPages,
      page,
    };
  }
}
