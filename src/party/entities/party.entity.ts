import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'party' })
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  images: string[];

  @Column('timestamptz')
  startDateAt: Date;

  @Column({ length: 255 })
  kakaoId: string;

  @Column({ default: false })
  isClosed: boolean;
}
