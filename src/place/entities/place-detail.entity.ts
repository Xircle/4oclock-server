import { Place } from './place.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('text', { array: true })
  photos: string[];

  @OneToOne((type) => Place, (place) => place.placeDetail)
  place: Place;
}
