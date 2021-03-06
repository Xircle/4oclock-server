import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Place } from '@place/entities/place.entity';
import { User } from '@user/entities/user.entity';
@Index(['place_id', 'user_id'])
@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { array: true, nullable: true, length: 511 })
  imageUrls: string[];

  @Column({ length: 511 })
  description: string;

  @Column({ nullable: true })
  ratings?: number;

  @Column({ default: 0 })
  likesNumber: number;

  @Column('uuid')
  place_id: string;

  @ManyToOne((type) => Place, (place) => place.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
