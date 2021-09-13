import { Place } from './../../place/entities/place.entity';
import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StartTime {
  Four = 'Four',
  Seven = 'Seven',
}

@Index(['userId', 'placeId'], { unique: true })
@Entity({ name: 'reservations' })
export class Reservation extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: StartTime })
  startTime: StartTime;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  placeId: string;

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  participant: User;

  @ManyToOne((type) => Place, { cascade: true, eager: true })
  @JoinColumn({ name: 'placeId' })
  place: Place;
}
