import { Review } from 'src/review/entities/review.entity';
import { Message } from './../../message/entities/message.entity';
import { Room } from './../../room/entities/room.entity';
import { Reservation } from './../../reservation/entities/reservation.entity';
import { UserProfile } from './user-profile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEnum, IsString, Length } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Admin = 'Admin',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true, length: 255 })
  email: string;

  @IsString()
  @Length(5, 20)
  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToOne((type) => UserProfile, (profile) => profile.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  profile: UserProfile;

  @OneToMany((type) => Reservation, (reservation) => reservation.participant)
  reservations: Reservation[];

  @ManyToMany((type) => Room, (room) => room.users)
  rooms: Room[];

  @ManyToMany((type) => Message, (message) => message.user)
  messages: Message[];

  @OneToMany((type) => Review, (review) => review.user)
  reviews: Review[];

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;

  async checkPassword(password: string): Promise<boolean> {
    try {
      console.log(password, this.password);
      return bcrypt.compare(password, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
