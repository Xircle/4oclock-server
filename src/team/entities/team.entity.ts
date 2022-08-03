import { User } from '@user/entities/user.entity';
import { Place } from '@place/entities/place.entity';
import { number } from 'joi';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: '미정' })
  name: string;

  @Column({ nullable: true })
  season?: number;

  @OneToMany((type) => Place, (place) => place.team)
  places: Place[];

  @OneToMany((type) => User, (user) => user.team)
  users: User[];
}
