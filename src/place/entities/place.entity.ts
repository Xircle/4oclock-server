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

  @Index()
  @Column({ length: 255 })
  location: string;

  @Column({ type: 'json' })
  tags: string[];

  @Column({ length: 255 })
  recommendation: string;

  @Index()
  @Column({
    type: 'date',
    nullable: true,
  })
  startDateAt: Date;

  @Column({ default: false })
  isClosed: boolean;

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
