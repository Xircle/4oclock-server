import { Room } from './room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index('user_id', ['userId'])
@Entity()
export class RoomToUser {
  @PrimaryGeneratedColumn()
  postToCategoryId!: string;

  @Column('uuid')
  roomId: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Room, (room) => room.roomToUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roomId', referencedColumnName: 'id' }])
  room: Room;

  @ManyToOne(() => User, (users) => users.rooms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
