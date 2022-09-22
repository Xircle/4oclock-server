import { Team } from './../../team/entities/team.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany((type) => Team, (team) => team.category)
  teams: Team;

  @Column({ nullable: true })
  image?: string;
}
