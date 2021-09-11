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

@Index(['provider', 'socialId'])
@Entity('social_accounts', {
  synchronize: false,
})
export default class SocialAccount extends CoreEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  socialId!: string;

  @Column({ length: 255 })
  provider!: string;

  @OneToOne((type) => User, { cascade: true })
  @JoinColumn({ name: 'fkUserId' })
  user!: User;

  @Column('uuid')
  fkUserId!: string;
}
