import { Place } from 'src/place/entities/place.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 512 })
  reviewImageUrl: string;

  @Column({ length: 255 })
  description: string;

  @Column({ default: 0 })
  ratings: number;

  @Column({ default: 0 })
  likesNumber: number;

  @Column('uuid')
  place_id: string;

  @ManyToOne((type) => Place)
  @JoinColumn({ name: 'place_id' })
  place: Place;
}
