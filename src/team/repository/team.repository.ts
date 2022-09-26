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

  public async findTeamsWithFilter(categoryIds: string[]): Promise<Team[]> {
    const teams = await this.createQueryBuilder()
      .where('category_id in (:...categoryIds)', {
        categoryIds: categoryIds,
      })
      .getMany();
    return teams;
  }
}
