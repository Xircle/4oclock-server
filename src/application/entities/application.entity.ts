import { Gender } from './../../user/entities/user-profile.entity';
import { Team } from 'team/entities/team.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @ManyToOne((type) => Team, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'team_id' })
  team?: Team;

  @Column('integer')
  team_id: number;

  @Column('boolean', { default: false })
  paid: boolean;

  @Column({ nullable: true })
  content?: string;

  @Column('timestamptz')
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isCanceled: boolean;

  @Column()
  image: string;

  @Column('boolean', { default: false })
  isCancelRequested: boolean;

  @Column({ nullable: true })
  cancelReason?: string;
}
