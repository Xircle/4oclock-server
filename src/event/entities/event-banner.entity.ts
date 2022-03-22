import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EventName {
  Halloween = 'Halloween',
}

@Entity({ name: 'event_banners' })
export class EventBanner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: EventName,
    default: EventName.Halloween,
  })
  eventName: EventName;

  @Column({ length: 255, nullable: true })
  mainHeading: string;

  @Column({ length: 255, nullable: true })
  subHeading?: string;

  @Column({ length: 1023, nullable: true })
  linkUrl?: string;

  @Column({
    length: 512,
    nullable: true,
    type: 'varchar',
  })
  eventImageUrl?: string;

  @Column('timestamptz')
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
