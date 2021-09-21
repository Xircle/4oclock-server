import { Reservation } from './../../reservation/entities/reservation.entity';
import { PlaceDetail } from './place-detail.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
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

  @Column({ name: 'cover_image', length: 255 })
  coverImage: string;

  @Index()
  @Column({ length: 255 })
  location: string;

  @Column({ type: 'json' })
  tags: string[];

  @Column({ length: 255 })
  recommendation: string;

  @Index()
  @Column({
    name: 'start_date_at',
    type: 'date',
    nullable: true,
  })
  startDateAt: Date;

  @Column({ name: 'is_closed', default: false })
  isClosed: boolean;

  @Column({ name: 'participant_count', default: 0 })
  participantsCount: number;

  @OneToOne((type) => PlaceDetail, (placeDetail) => placeDetail.place, {
    cascade: true,
    eager: true,
  })
  placeDetail: PlaceDetail;

  @OneToMany((type) => Reservation, (reservation) => reservation.place)
  reservations: Reservation[];
}
