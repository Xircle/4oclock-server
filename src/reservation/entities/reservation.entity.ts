import { Place } from './../../place/entities/place.entity';
import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StartTime {
  Four = 'Four',
  Seven = 'Seven',
}

@Index([''])
@Entity({ name: 'reservations' })
export class Reservation extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => User, (user) => user.reservations)
  participant: User;

  @Column({ type: 'enum', enum: true })
  startTime: StartTime;

  @OneToOne((type) => Place)
  @JoinColumn({ name: 'fkPlaceId' })
  place: Place;

  @Column('uuid')
  fkPlaceId: string;
}
