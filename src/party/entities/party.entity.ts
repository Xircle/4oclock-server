import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'party' })
export class Place {
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

  @Column({ length: 255 })
  images: string[];

  @Column('timestamptz')
  startDateAt: Date;

  @Column({ length: 255 })
  kakaoId: string;

  @Column({ default: false })
  isClosed?: boolean;

  @Column({ length: 511 })
  description: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 255 })
  placeName: string;

  @Column({ length: 511, nullable: true })
  externalLink?: string;

  @Column({ length: 124 })
  fee: string;

  @Column({ length: 1023, default: [] })
  participatingRecommendations: string[];

  @Column({ length: 1023, default: '입력된 부분이 없습니다' })
  invitationDetail?: string;

  @Column({ length: 1023, default: '입력된 부분이 없습니다' })
  InvitaionInstruction?: string;
}
