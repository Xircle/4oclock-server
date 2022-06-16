import { Reservation } from '@reservation/entities/reservation.entity';
import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'party' })
export class Party {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ length: 255 })
  name: string;

  @Column('varchar', { array: true, nullable: true })
  images?: string[];

  @Column('timestamptz')
  startDateAt: Date;

  @Column({ length: 255, nullable: true })
  kakaoPlaceId?: string;

  @Column({ default: false })
  isClosed?: boolean;

  @Column({ length: 511 })
  description: string;

  @Column({ length: 255, nullable: true })
  kakaoAddress?: string;

  @Column({ length: 255, nullable: true })
  kakaoPlaceName?: string;

  @Column({ length: 511, nullable: true })
  externalLink?: string;

  @Column({ length: 124, default: '무료' })
  fee?: string;

  @Column('varchar', { array: true, nullable: true })
  participatingRecommendations?: string[];

  @Column({ length: 1023, default: '입력된 부분이 없습니다' })
  invitationDetail?: string;

  @Column({ length: 1023, default: '입력된 부분이 없습니다' })
  invitaionInstruction?: string;

  @Column({ default: 0 })
  maxParticipantsCount?: number;

  @OneToMany((type) => Reservation, (reservation) => reservation.party)
  reservations: Reservation[];

  @Expose()
  returnCurParticipantsCount(): number {
    return Reservation.length;
  }
}
