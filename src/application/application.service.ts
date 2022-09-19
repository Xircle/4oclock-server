import { CreateApplicationInput } from './dtos/create-application.dto';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from './../common/common.interface';
import { ApplicationRepository } from './repositories/application.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}
  async createApplication(
    authUser: User,
    { teamId }: CreateApplicationInput,
  ): Promise<CoreOutput> {
    try {
      const application = this.applicationRepository.create({
        team_id: teamId,
        user_id: authUser.id,
      });
      await this.applicationRepository.save(application);
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
