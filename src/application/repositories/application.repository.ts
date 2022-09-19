import { Application } from '../entities/application.entity';
import {
  DeepPartial,
  EntityManager,
  EntityRepository,
  FindConditions,
  FindManyOptions,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {}
