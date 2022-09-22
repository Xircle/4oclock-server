import { UserRepository } from '@user/repositories/user.repository';
import { TeamRepository } from './../team/repository/team.repository';
import { EditApplicationInput } from './dtos/edit-application.dto';
import { CreateApplicationInput } from './dtos/create-application.dto';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from './../common/common.interface';
import { ApplicationRepository } from './repositories/application.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApplicationStatus } from './entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
  ) {}
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
      const exists = await this.applicationRepository.findOne({
        where: {
          id: editApplicationInput.applicationId,
        },
      });
      if (!exists) {
        return { ok: false, error: '지원서가 존재하지 않아요' };
      }
      if (editApplicationInput.paid.toLowerCase() === 'true') {
        this.userRepository.update(
          {
            id: exists.user_id,
          },
          {
            team_id: exists.team_id,
          },
        );
      }

      await this.applicationRepository.update(
        {
          id: editApplicationInput.applicationId,
        },
        {
          status:
            editApplicationInput.status !== undefined &&
            editApplicationInput.status !== null
              ? editApplicationInput.status
              : exists.status,
          isCanceled:
            editApplicationInput.isCanceled === undefined ||
            editApplicationInput.isCanceled === null
              ? exists.isCanceled
              : editApplicationInput.isCanceled.toLowerCase() === 'true',
          paid:
            editApplicationInput.paid === undefined ||
            editApplicationInput.paid === null
              ? exists.paid
              : editApplicationInput.paid.toLowerCase() === 'true',
        },
      );

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
