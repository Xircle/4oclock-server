import { Application } from '../../application/entities/application.entity';
import { User } from '@user/entities/user.entity';
import { Place } from '@place/entities/place.entity';
import { number } from 'joi';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
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

  @OneToMany((type) => Application, (application) => application.team)
  applications?: Application[];

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ nullable: true })
  endDate?: Date;

  @Column({ nullable: true })
  description?: string;

  @Column('varchar', { array: true, nullable: true, length: 511 })
  images?: string[];

  @Column({ nullable: true })
  category?: string;
}
