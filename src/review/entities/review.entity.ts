import { User } from 'src/user/entities/user.entity';
import { Place } from 'src/place/entities/place.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Index(['place_id', 'user_id'])
@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 512 })
  reviewImageUrl: string;

  @Column({ length: 255 })
  description: string;

  @Column({ nullable: true })
  ratings?: number;

  @Column({ default: 0 })
  likesNumber: number;

  @Column('uuid')
  place_id: string;

  @ManyToOne((type) => Place)
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
