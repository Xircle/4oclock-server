import { User } from './../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findRandomUser(userId: string, ykClubOnly?: boolean) {
    const queryBuilder = this.createQueryBuilder('User')
      .where(`User.id != :id`, { id: userId })
      .leftJoinAndSelect('User.profile', 'userprofile')
      .orderBy('RANDOM()');
    return ykClubOnly
      ? queryBuilder
          .andWhere(`User.isYkClub = :isYkClub`, { isYkClub: ykClubOnly })
          .getOne()
      : queryBuilder.getOne();
  }
}
