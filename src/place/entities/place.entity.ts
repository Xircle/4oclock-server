import { PlaceDetail } from './place-detail.entity';
import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'places' })
export class Place extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  coverImage: string;

  @Index()
  @Column({ length: 255 })
  location: string;

  @Column('text', { array: true })
  tags: string[];

  @Column({ length: 255 })
  recommendations: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  startAt: Date;

  @ManyToMany((type) => User, (user) => user.places)
  @JoinTable()
  participants: User[];

  @Column({ default: 0 })
  participantsCount: number;

  @OneToOne((type) => PlaceDetail, (placeDetail) => placeDetail.place)
  @JoinColumn()
  placeDetail: PlaceDetail;

  @Column({ default: false })
  isClosed: boolean;
}
