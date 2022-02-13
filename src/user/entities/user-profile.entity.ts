import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Max, MaxLength, Min, MinLength } from 'class-validator';

export enum Gender {
  Female = 'Female',
  Male = 'Male',
}

@Entity({ name: 'user_profiles' })
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Min(1)
  @Max(20)
  username: string;

  @Column({ length: 255 })
  phoneNumber: string;

  @Column({ length: 255 })
  university: string;

  @Column()
  isGraduate: boolean;

  @Column()
  age: number;

  @Column({ nullable: true })
  sofoCode?: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Male,
  })
  gender: Gender;

  @Column({ length: 255 })
  @MaxLength(8)
  job: string;

  @Column({ length: 1023 })
  @MinLength(1)
  shortBio: string;

  @Column({ length: 255, nullable: true })
  activities?: string;

  @Column({ length: 255, nullable: true })
  personality?: string;

  @Column({ length: 255, nullable: true })
  MBTI?: string;

  @Column({ nullable: true })
  drinkingStyle?: number;

  @Column({ default: false })
  isYkClub: boolean;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ type: 'json', nullable: true })
  interests?: string[];

  @Column({
    length: 512,
    nullable: true,
    type: 'varchar',
  })
  profileImageUrl?: string;

  @Column({ default: false })
  isMarketingAgree: boolean;

  @OneToOne((type) => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id' })
  user: User;

  @Column('uuid')
  fk_user_id: string;

  @Column({ nullable: true })
  team?: string;

  @Column('timestamptz', { name: 'created_at', select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { name: 'created_at', select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
