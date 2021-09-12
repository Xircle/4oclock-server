import { PlaceDetail } from './place-detail.entity';
import { User } from './../../user/entities/user.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import {
  Column,
  Entity,
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

  @Column('text', { array: true })
  tags: string[];

  @Column({ nullable: true })
  minAge: number;

  @Column({ nullable: true })
  maxAge: number;

  @ManyToMany((type) => User, (user) => user.places)
  @JoinTable()
  participants: User[];

  @OneToOne((type) => PlaceDetail, (placeDetail) => placeDetail.place)
  @JoinColumn()
  placeDetail: PlaceDetail;

  @Column({ default: false })
  isClosed: boolean;
}
