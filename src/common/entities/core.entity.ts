import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class CoreEntity {
  @Column('timestamptz')
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedAt: Date;
}
