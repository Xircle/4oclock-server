import { EntityRepository, Repository } from 'typeorm';
import { Team } from '../entities/team.entity';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  public async findManyTeams(): Promise<Team[]> {
    return this.find({
      order: {
        id: 'ASC',
      },
    });
  }
}
