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

@Index(['place_id', 'user_id'], { unique: true })
@Entity({ name: 'reservations' })
export class Reservation extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'start_time', type: 'enum', enum: StartTime })
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
}
