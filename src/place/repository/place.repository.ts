import { HttpException, HttpStatus } from '@nestjs/common';
import {
  DeepPartial,
  EntityManager,
  EntityRepository,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Place } from '../entities/place.entity';

@EntityRepository(Place)
export class PlaceRepository extends Repository<Place> {
  public async findManyPlaces(
    options: FindManyOptions<Place>,
  ): Promise<Place[]> {
    const places = await this.find({
      ...options,
    });
    return places;
  }

  /**
   *
   * @description placeId로 Place entity를 찾고 없을 경우 HttpException을 throw한다.
   */
  public async findPlaceByIdAndCheckException(
    placeId: string,
    options?: FindOneOptions<Place>,
  ): Promise<Place> {
    const qb = this.createQueryBuilder('places')
      .where('places.id = :placeId', { placeId })
      .leftJoinAndSelect(
        'places.reviews',
        'reviews',
        'reviews.isRepresentative = true',
      )
      .leftJoinAndSelect('places.placeDetail', 'placeDetail');

    const place = await qb.getOne();
    return place;
    // const place = await this.findOne({
    //   where: {
    //     id: placeId,
    //   },
    //   ...options,
    // });
    // this.checkPlaceException(place);
    // return place;
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

  public checkPlaceException(entity: Place) {
    if (!entity) {
      throw new HttpException(
        '존재하지 않는 장소입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
