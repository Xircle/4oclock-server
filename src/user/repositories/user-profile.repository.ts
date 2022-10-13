import { EntityRepository, Repository } from 'typeorm';
import { UserProfile } from './../entities/user-profile.entity';
@EntityRepository(UserProfile)
export class UserProfileRepository extends Repository<UserProfile> {}
