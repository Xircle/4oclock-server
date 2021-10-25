import { PlaceDetail } from './../entities/place-detail.entity';
import {
  DeepPartial,
  EntityManager,
  EntityRepository,
  Repository,
} from 'typeorm';

@EntityRepository(PlaceDetail)
export class PlaceDetailRepository extends Repository<PlaceDetail> {
  /**
   *
   * @param entityLike
   * @param entityManager
   * @description entity를 create하고 save한다. Transaction 상황에는 entityManager가 save한다.
   */
  public async createAndSavePlaceDetail(
    entityLike: DeepPartial<PlaceDetail>,
    entityManager?: EntityManager,
  ): Promise<PlaceDetail> {
    const placeDetail = this.create(entityLike);
    if (entityManager) {
      await entityManager.save(placeDetail);
    } else {
      await this.save(placeDetail);
    }
    return placeDetail;
  }
}
