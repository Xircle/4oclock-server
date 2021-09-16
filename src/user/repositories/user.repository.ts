import { User } from './../entities/user.entity';
import { AbstractRepository, EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findRandomUser(userId: string) {
    const queryBuilder = this.createQueryBuilder('User')
      .where(`User.id != :id`, { id: userId })
      .leftJoinAndSelect('User.profile', 'userProfile')
      .orderBy('RANDOM()');
    return queryBuilder.getOne();
  }
}
