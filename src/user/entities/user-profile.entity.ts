import { User } from './user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MaxLength, MinLength } from 'class-validator';

export enum Gender {
  female = 'female',
  male = 'male',
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  username: string;

  @Column({ length: 255 })
  phoneNumber: string;

  @Column({ length: 255 })
  university: string;

  @Column()
  isGraduate: boolean;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column()
  isProfilePrivate: boolean;

  @Column({ length: 255 })
  @MaxLength(8)
  job: string;

  @Column({ length: 255 })
  @MinLength(1)
  shortBio: string;

  @Column({ length: 255, nullable: true })
  location: string | null;

  @Column({ length: 255, nullable: true, type: 'varchar' })
  profileImageUrl: string | null;

  @Column('text', { array: true, nullable: true })
  interests: string[] | null;

  @Column()
  isMarketingAgree: boolean;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fkUserId' })
  user: User;

  @Column('uuid')
  fkUserId: string;
}
