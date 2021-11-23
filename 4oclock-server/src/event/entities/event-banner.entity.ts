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

@Entity({ name: 'eventBanners' })
export class EventBanner {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({
    type: 'enum',
    enum: EventName,
    default: EventName.Halloween,
  })
  eventName: EventName;

  @Column({
    length: 512,
    nullable: true,
    type: 'varchar',
  })
  eventImageUrl?: string;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
