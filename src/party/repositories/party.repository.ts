import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  DeepPartial,
  EntityRepository,
  FindManyOptions,
  Repository,
  EntityManager,
  FindConditions,
} from 'typeorm';
import { Party } from './../entities/party.entity';

@EntityRepository(Party)
export class PartyRepository extends Repository<Party> {
  public async findOneByPartyId(partyId: string): Promise<Party> {
    return await this.findOne({ id: partyId });
  }

  public async findManyParties(
    options: FindManyOptions<Party>,
  ): Promise<Party[]> {
    return this.find({
      ...options,
    });
  }

  /**
   *
   * @param entityLike
   * @param entityManager
   * @description entity를 create하고 save한다. Transaction 상황에는 entityManager가 save한다.
   */
  public async createAndSaveParty(
    entityLike: DeepPartial<Party>,
    entityManager?: EntityManager,
  ): Promise<Party> {
    const party = this.create(entityLike);
    if (entityManager) {
      await entityManager.save(party);
    } else {
      await this.save(party);
    }
    return party;
  }

  public async saveParty(entity: Party): Promise<Party> {
    return this.save(entity);
  }

  public async updateParty(
    criteria: FindConditions<Party>,
    partialEntity: QueryDeepPartialEntity<Party>,
  ) {
    return this.update(criteria, partialEntity);
  }
}
