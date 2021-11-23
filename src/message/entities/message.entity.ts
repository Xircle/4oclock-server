import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '@room/entities/room.entity';
import { User } from '@user/entities/user.entity';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'uuid', nullable: true })
  roomId?: string | null;

  @Column({ type: 'uuid', nullable: true })
  senderId?: string | null;

  @Column({ type: 'uuid', nullable: true })
  receiverId?: string | null;

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

  @CreateDateColumn({ type: 'timestamp with time zone' })
  sentAt: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
