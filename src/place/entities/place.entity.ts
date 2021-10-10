import { Review } from 'src/review/entities/review.entity';
import { Reservation } from './../../reservation/entities/reservation.entity';
import { PlaceDetail } from './place-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'places' })
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  coverImage: string;

  @Column({ length: 255, default: '' })
  oneLineIntroText: string;

  @Index()
  @Column({ length: 255 })
  location: string;

  @Column({ length: 255 })
  recommendation: string;

  @Index()
  @Column({
    type: 'date',
    nullable: true,
  })
  startDateAt: Date;

  @Column({ default: 18 })
  startTime: number;

  @Column({ default: false })
  isClosed: boolean;

  @Column({ default: 0 })
  views: number;

  @OneToMany((type) => Review, (review) => review.place)
  reviews: Review[];

  @OneToOne((type) => PlaceDetail, (placeDetail) => placeDetail.place, {
    cascade: true,
    eager: true,
  })
  placeDetail: PlaceDetail;

  @OneToMany((type) => Reservation, (reservation) => reservation.place)
  reservations: Reservation[];

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
