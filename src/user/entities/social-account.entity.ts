import { CoreEntity } from '../../common/entities/core.entity';
import { User } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Index(['socialId', 'provider'], { unique: true })
@Entity('social_accounts', {
  synchronize: true,
})
export default class SocialAccount extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'social_id', length: 255 })
  socialId!: string;

  @Column({ length: 255 })
  provider!: string;

  @OneToOne((type) => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  @Column('uuid')
  fk_user_id!: string;
}
