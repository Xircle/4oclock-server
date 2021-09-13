import { Reservation } from './../../reservation/entities/reservation.entity';
import { PlaceDetail } from './place-detail.entity';
import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'places' })
export class Place extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  coverImage: string;

  @Index()
  @Column({ length: 255 })
  location: string;

  @Column('text', { array: true })
  tags: string[];

  @Column({ length: 255 })
  recommendation: string;

  @Index()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  startDateAt: Date;

  @ManyToMany((type) => User, (user) => user.places)
  @JoinTable()
  participants: User[];

  @Column({ default: 0 })
  participantsCount: number;

  @OneToOne((type) => PlaceDetail, { cascade: true })
  @JoinColumn()
  placeDetail: PlaceDetail;

  @OneToMany((type) => Reservation, (reservation) => reservation.place)
  reservations: Reservation[];

  @Column({ default: false })
  isClosed: boolean;
}
