import { Place } from './../../place/entities/place.entity';
import { User } from './../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StartTime {
  Four = 'Four',
  Seven = 'Seven',
}

@Index(['place_id', 'user_id'], { unique: true })
@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: StartTime })
  startTime: StartTime;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  place_id: string;

  @ManyToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  participant: User;

  @ManyToOne((type) => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
