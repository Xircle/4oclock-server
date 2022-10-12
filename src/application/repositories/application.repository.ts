import {
  MyApplication,
  MyApplicationsByStatus,
} from './../../user/dtos/get-my-applications.dto';
import { Application, ApplicationStatus } from '../entities/application.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {
  public async findByStatus(
    userId: string,
    status: ApplicationStatus,
    isCanceled: boolean = false,
  ): Promise<Application[]> {
    const data = await this.find({
      where: {
        user_id: userId,
        status: status,
        isCanceled: false,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['team'],
    });
    return data;
  }

  convertFromRawApplications(applications: Application[]): MyApplication[] {
    const converted: MyApplication[] = [];

    for (let application of applications) {
      converted.push({
        id: application.id,
        teamName: application.team.name,
        status: application.status,
        teamId: application.team.id,
        appliedAt: application.createdAt,
        isCanceled: application.isCanceled,
        paid: application.paid,
        teamImage: application.team.images[0],
      });
    }

    return converted;
  }

  public async findApplicationsByStatus(
    userId: string,
  ): Promise<MyApplicationsByStatus> {
    const approveds = await this.findByStatus(
      userId,
      ApplicationStatus.Approved,
      false,
    );
    const disapproveds = await this.findByStatus(
      userId,
      ApplicationStatus.Disapproved,
      false,
    );
    const enrolleds = await this.findByStatus(
      userId,
      ApplicationStatus.Enrolled,
      false,
    );
    const pendings = await this.findByStatus(
      userId,
      ApplicationStatus.Pending,
      false,
    );

    const approvedsConverted: MyApplication[] =
      this.convertFromRawApplications(approveds);
    const disapprovedsConverted: MyApplication[] =
      this.convertFromRawApplications(disapproveds);
    const enrolledsConverted: MyApplication[] =
      this.convertFromRawApplications(enrolleds);
    const pendingsConverted: MyApplication[] =
      this.convertFromRawApplications(pendings);

    return {
      approveds: approvedsConverted,
      disapproveds: disapprovedsConverted,
      enrolleds: enrolledsConverted,
      pendings: pendingsConverted,
    };
  }
}
