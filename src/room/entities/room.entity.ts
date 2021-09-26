import { Message } from './../../message/entities/message.entity';
import { CoreEntity } from './../../common/entities/core.entity';
import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'rooms' })
export class Room extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany((type) => User, (user) => user.rooms)
  users: User[];

  @OneToMany((type) => Message, (message) => message.room)
  messages: Message[];
}
