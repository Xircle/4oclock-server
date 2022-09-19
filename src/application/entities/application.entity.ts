import { Team } from 'team/entities/team.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ApplicationStatus {
  Approved = 'Approved',
  Disapproved = 'Disapproved',
  Enrolled = 'Enrolled',
  Pending = 'Pending',
}

@Entity({ name: 'applications' })
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.Pending,
  })
  status: ApplicationStatus;

  @ManyToOne((type) => User, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  applicant?: User;

  @Column('uuid')
  user_id: string;

  @ManyToOne((type) => Team, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'team_id' })
  team?: Team;

  @Column('integer')
  team_id: string;

  @Column('boolean', { default: false })
  paid: boolean;

  @Column('timestamptz')
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
