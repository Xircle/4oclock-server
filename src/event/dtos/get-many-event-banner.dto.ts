import { EventBanner } from './../entities/event-banner.entity';
import { CoreOutput } from './../../common/common.interface';

export class GetManyEventBannersOutput extends CoreOutput {
  eventBanners: EventBanner[];
}
