import { Place } from 'src/place/entities/place.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
<<<<<<< HEAD
  Index,
  UpdateDateColumn,
  CreateDateColumn,
=======
>>>>>>> a9ade52ec571f1f2b33eeb6832caba64e83dd578
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

<<<<<<< HEAD
  @Index()
=======
>>>>>>> a9ade52ec571f1f2b33eeb6832caba64e83dd578
  @Column('uuid')
  place_id: string;

  @ManyToOne((type) => Place)
  @JoinColumn({ name: 'place_id' })
  place: Place;
<<<<<<< HEAD

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
=======
>>>>>>> a9ade52ec571f1f2b33eeb6832caba64e83dd578
}
