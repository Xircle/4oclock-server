import { Reservation } from './../../reservation/entities/reservation.entity';
import { UserProfile } from './user-profile.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
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
export class User extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ unique: true, length: 255 })
  email: string;

  @IsString()
  @Length(5, 20)
  @Column({ nullable: true })
  password?: string;

  @Column({ name: 'is_verified', default: false })
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
