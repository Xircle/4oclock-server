import { Application as Application } from '../../application/entities/application.entity';
import { Team } from 'team/entities/team.entity';
import { Place } from '@place/entities/place.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsEnum, Length } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import { Room } from '@room/entities/room.entity';
import { Reservation } from '@reservation/entities/reservation.entity';
import { Message } from '@message/entities/message.entity';
import { Review } from '@review/entities/review.entity';
import { UserProfile } from './user-profile.entity';
import { Exclude, Expose } from 'class-transformer';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Admin = 'Admin',
  Banned = 'Banned',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true, length: 255 })
  email: string;

  @Exclude()
  @Length(5, 20)
  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  isVerified?: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToOne((type) => UserProfile, (profile) => profile.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  profile?: UserProfile;

  @Column('varchar', { array: true, nullable: true })
  firebaseToken?: string[];

  @OneToMany((type) => Reservation, (reservation) => reservation.participant)
  reservations?: Reservation[];

  @ManyToMany((type) => Room, (room) => room.users)
  @JoinTable()
  rooms?: Room[];

  @OneToMany((type) => Application, (application) => application.applicant)
  applications?: Application[];

  @ManyToMany((type) => Message, (message) => message.sender, {
    nullable: true,
  })
  messages?: Message[];

  @OneToMany((type) => Review, (review) => review.user)
  reviews?: Review[];

  @OneToMany((type) => Place, (place) => place.creator)
  createdPlaces: Place[];

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt?: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne((type) => Team, (team) => team.users)
  team?: Team;

  @Column('integer', { nullable: true })
  team_id?: number;

  @Expose()
  async checkPassword?(password: string): Promise<boolean> {
    try {
      return true;
      return bcrypt.compare(password, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
