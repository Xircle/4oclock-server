import { Place } from 'src/place/entities/place.entity';
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

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
