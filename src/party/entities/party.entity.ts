import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'party' })
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;
}
