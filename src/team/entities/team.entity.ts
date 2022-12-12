import { Category } from './../../category/entities/category.entity';
import { Application } from '../../application/entities/application.entity';
import { User } from '@user/entities/user.entity';
import { Place } from '@place/entities/place.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: '미정' })
  name: string;

  @Column({ nullable: true })
  season?: number;

  @OneToMany((type) => Place, (place) => place.team)
  places: Place[];

  @Column('uuid', { nullable: true })
  leader_id: string;

  @OneToMany((type) => User, (user) => user.team)
  users: User[];

  @Column({ default: '자기소개 부탁해요' })
  question: string;

  @OneToMany((type) => Application, (application) => application.team)
  applications?: Application[];

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  price?: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  area_info?: string;

  @Column('varchar', { array: true, nullable: true, length: 511 })
  images?: string[];

  @ManyToOne((type) => Category, (category) => category.teams)
  @JoinColumn({ name: 'category_id' })
  category: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @Column({ default: 16 })
  maxParticipant: number;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ default: 20, nullable: true })
  maleMinAge?: number;

  @Column({ default: 30, nullable: true })
  maleMaxAge?: number;

  @Column({ default: 20, nullable: true })
  femaleMinAge?: number;

  @Column({ default: 30, nullable: true })
  femaleMaxAge?: number;

  @Column({ nullable: true })
  meetingDay: number;

  @Column({ nullable: true })
  meetingHour: number;

  @Column({ nullable: true })
  meetingMinute: number;

  @Column({ nullable: true })
  leaderIntro?: string;

  // error 가능성 높음
  @Column('varchar', { default: [], nullable: true, array: true })
  area_ids: string[];

  @Column('varchar', { array: true, default: [], nullable: true })
  activity_titles?: string[];

  @Column('varchar', { default: [], array: true, nullable: true })
  activity_details?: string[];

  @Column('varchar', { nullable: true })
  mission?: string;
}
