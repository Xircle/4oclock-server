import { EditApplicationInput } from './dtos/edit-application.dto';
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
      const exists = await this.applicationRepository.findOne({
        where: {
          team_id: teamId,
          user_id: authUser.id,
        },
      });
      if (exists && !exists.isCanceled) {
        return {
          ok: false,
          error: '이미 신청하셨습니다.',
        };
      }
      if (exists) {
        await this.applicationRepository.update(
          {
            user_id: authUser.id,
            team_id: teamId,
          },
          {
            isCanceled: false,
          },
        );
      } else {
        const application = this.applicationRepository.create({
          team_id: teamId,
          user_id: authUser.id,
        });
        await this.applicationRepository.save(application);
      }

      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async editApplication(
    editApplicationInput: EditApplicationInput,
  ): Promise<CoreOutput> {
    try {
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
