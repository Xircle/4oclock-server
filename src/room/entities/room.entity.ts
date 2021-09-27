import { Message } from './../../message/entities/message.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany((type) => User, (user) => user.rooms)
  users: User[];

  @OneToMany((type) => Message, (message) => message.room)
  messages: Message[];

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
