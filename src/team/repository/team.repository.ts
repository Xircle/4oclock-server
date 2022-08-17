import { EntityRepository, Repository } from 'typeorm';
import { Team } from '../entities/team.entity';

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
}
