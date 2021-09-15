import { CoreEntity } from './../../common/entities/core.entity';
import { Place } from './place.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'place_detail' })
export class PlaceDetail extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  description!: string;

  @Column({ type: 'json' })
  categories: string[];

  @Column({ type: 'json' })
  photos: string[];

  @Column({ length: 255 })
  detailAddress: string;

  @OneToOne((type) => Place, (place) => place.placeDetail, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({ type: 'uuid' })
  place_id: string;
}
