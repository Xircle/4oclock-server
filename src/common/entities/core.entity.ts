import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class CoreEntity {
  @Column('timestamptz', { name: 'created_at', select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { name: 'created_at', select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
