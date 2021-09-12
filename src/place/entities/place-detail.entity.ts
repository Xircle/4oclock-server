import { Place } from './place.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'place_detail' })
export class PlaceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column('text', { array: true })
  categories: string[];

  @Column({ length: 255 })
  address: string;

  @Column('text', { array: true })
  photos: string[];

  @OneToOne((type) => Place, (place) => place.placeDetail)
  place: Place;
}
