import {
  MyApplication,
  MyApplicationsByStatus,
} from './../../user/dtos/get-my-applications.dto';
import { Application, ApplicationStatus } from '../entities/application.entity';
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
export class ApplicationRepository extends Repository<Application> {
  public async findApplicationsByStatus(
    userId: string,
  ): Promise<MyApplicationsByStatus> {
    const approveds = await this.find({
      where: {
        user_id: userId,
        status: ApplicationStatus.Approved,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['team'],
    });
    const disapproveds = await this.find({
      where: {
        user_id: userId,
        status: ApplicationStatus.Disapproved,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['team'],
    });
    const enrolleds = await this.find({
      where: {
        user_id: userId,
        status: ApplicationStatus.Enrolled,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['team'],
    });

    const pendings = await this.find({
      where: {
        user_id: userId,
        status: ApplicationStatus.Pending,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['team'],
    });

    const approvedsConverted: MyApplication[] = [];
    const disapprovedsConverted: MyApplication[] = [];
    const enrolledsConverted: MyApplication[] = [];
    const pendingsConverted: MyApplication[] = [];

    for (let approved of approveds) {
      approvedsConverted.push({
        id: approved.id,
        teamName: approved.team.name,
        status: approved.status,
        teamId: approved.team.id,
        appliedAt: approved.createdAt,
        isCanceled: approved.isCanceled,
        paid: approved.paid,
      });
    }

    for (let disapproved of disapproveds) {
      disapprovedsConverted.push({
        id: disapproved.id,
        teamName: disapproved.team.name,
        status: disapproved.status,
        teamId: disapproved.team.id,
        appliedAt: disapproved.createdAt,
        isCanceled: disapproved.isCanceled,
        paid: disapproved.paid,
      });
    }

    for (let pending of pendings) {
      pendingsConverted.push({
        id: pending.id,
        teamName: pending.team.name,
        status: pending.status,
        teamId: pending.team.id,
        appliedAt: pending.createdAt,
        isCanceled: pending.isCanceled,
        paid: pending.paid,
      });
    }

    for (let enrolled of enrolleds) {
      enrolledsConverted.push({
        id: enrolled.id,
        teamName: enrolled.team.name,
        status: enrolled.status,
        teamId: enrolled.team.id,
        appliedAt: enrolled.createdAt,
        isCanceled: enrolled.isCanceled,
        paid: enrolled.paid,
      });
    }

    return {
      approveds: approvedsConverted,
      disapproveds: disapprovedsConverted,
      enrolleds: enrolledsConverted,
      pendings: pendingsConverted,
    };
  }
}
