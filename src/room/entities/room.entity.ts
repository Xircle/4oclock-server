import { RoomToUser } from './rooms-to-user.entity';
import { Message } from './../../message/entities/message.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'rooms' })
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany((type) => RoomToUser, (roomToUser) => roomToUser.room)
  roomToUser: RoomToUser[];

  @ManyToMany((type) => User, (user) => user.rooms, {
    cascade: ['insert'],
  })
  @JoinTable({
    name: 'roomToUser',
    joinColumn: {
      name: 'roomId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
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
