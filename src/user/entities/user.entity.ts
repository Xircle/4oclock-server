import { UserProfile } from './user-profile.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
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

  @Index()
  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  username: string;

  @IsString()
  @Length(5, 20)
  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  @IsEnum(UserRole)
  role: UserRole;

  @OneToOne((type) => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      const salt = await bcrypt.genSalt();
      console.log(salt);
      this.password = await bcrypt.hash(this.password, salt);
    } catch {
      throw new InternalServerErrorException();
    }
  }

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
