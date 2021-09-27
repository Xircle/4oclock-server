import { User } from 'src/user/entities/user.entity';
import { Room } from './../../room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  payload: string;

  @ManyToOne((type) => Room, (room) => room.messages)
  room: Room;

  @ManyToOne((type) => User, (user) => user.messages)
  user: User;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
