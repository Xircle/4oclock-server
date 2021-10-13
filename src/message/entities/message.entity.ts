import { User } from 'src/user/entities/user.entity';
import { Room } from './../../room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  content: string;

  @Column({ type: 'uuid' })
  room_id: string;

  @Column({ type: 'uuid' })
  sender_id: string;

  @Column({ type: 'uuid' })
  receiver_id: string;

  @ManyToOne((type) => Room, (room) => room.messages, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne((type) => User, (user) => user.messages)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @ManyToOne((type) => User, (user) => user.messages)
  sender: User;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  sentDate: Date;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdDate: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedDate: Date;
}
