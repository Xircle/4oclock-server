import { EntityRepository, Repository } from 'typeorm';
import { EventBanner, EventName } from '../entities/event-banner.entity';

@EntityRepository(EventBanner)
export class EventBannerRepository extends Repository<EventBanner> {
  public async findRandomEventBanner(eventName: EventName) {
    const qb = this.createQueryBuilder('EventBanner')
      .where(`EventBanner.eventName = :eventName`, { eventName })
      .orderBy('RANDOM()');

    return qb.getOne();
  }
}
