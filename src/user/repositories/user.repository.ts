import { InternalServerErrorException } from '@nestjs/common';
import { User } from './../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findRandomUser(userId: string, ykClubOnly: boolean) {
    const queryBuilder = this.createQueryBuilder('User')
      .where(`User.id != :id`, { id: userId })
      .leftJoinAndSelect('User.profile', 'User_profile')
      .orderBy('RANDOM()');
    return ykClubOnly
      ? queryBuilder
          .andWhere(`User_profile.isYkClub = :isYkClub`, {
            isYkClub: ykClubOnly,
          })
          .getOne()
      : queryBuilder.getOne();
  }
}
