import { PlaceMetaData } from '@place/interface/places-with-meta';
import {
  DeepPartial,
  EntityManager,
  EntityRepository,
  FindConditions,
  FindManyOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Place } from '../entities/place.entity';

@EntityRepository(Place)
export class PlaceRepository extends Repository<Place> {
  public async findOneByPlaceId(placeId: string): Promise<Place> {
    return await this.findOne({ id: placeId });
  }

  public async findManyPlaces(
    options: FindManyOptions<Place>,
  ): Promise<Place[]> {
    return this.find({
      ...options,
    });
  }

  public async getPlaceMetaData(
    page: number,
    limit: number,
  ): Promise<PlaceMetaData> {
    const totalItems = await this.count();
    const totalPages = Math.floor(totalItems / limit) + 1;
    return {
      totalPages,
      page,
    };
  }

  /**
   *
   * @description placeId로 Place entity를 찾고 없을 경우 HttpException을 throw한다.
   */
  public async findDetailPlaceByPlaceId(placeId: string): Promise<Place> {
    const qb = this.createQueryBuilder('places')
      .where('places.id = :placeId', { placeId })
      .leftJoinAndSelect('places.placeDetail', 'placeDetail');

    return qb.getOne();
  }

  /**
   *
   * @param entityLike
   * @param entityManager
   * @description entity를 create하고 save한다. Transaction 상황에는 entityManager가 save한다.
   */
  public async createAndSavePlace(
    entityLike: DeepPartial<Place>,
    entityManager?: EntityManager,
  ): Promise<Place> {
    const place = this.create(entityLike);
    if (entityManager) {
      await entityManager.save(place);
    } else {
      await this.save(place);
    }
    return place;
  }

  public async savePlace(entity: Place): Promise<Place> {
    return this.save(entity);
  }

  public async updatePlace(
    criteria: FindConditions<Place>,
    partialEntity: QueryDeepPartialEntity<Place>,
  ) {
    return this.update(criteria, partialEntity);
  }
}
