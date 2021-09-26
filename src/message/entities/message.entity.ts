import { User } from 'src/user/entities/user.entity';
import { Room } from './../../room/entities/room.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'messages' })
export class Message extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  payload: string;

  @ManyToOne((type) => Room, (room) => room.messages)
  room: Room;

  @ManyToOne((type) => User, (user) => user.messages)
  user: User;
}
