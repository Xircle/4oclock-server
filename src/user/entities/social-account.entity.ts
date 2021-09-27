import { User } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index(['socialId', 'provider'], { unique: true })
@Entity('social_accounts', {
  synchronize: true,
})
export class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  socialId!: string;

  @Column({ length: 255 })
  provider!: string;

  @OneToOne((type) => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  @Column('uuid')
  fk_user_id!: string;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
