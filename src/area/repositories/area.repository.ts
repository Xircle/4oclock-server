import { Area } from './../entities/area.entity';
import { EntityRepository, Repository, FindManyOptions } from 'typeorm';

@EntityRepository(Area)
export class AreaRepository extends Repository<Area> {}
