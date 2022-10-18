import { UserRole } from '@user/entities/user.entity';
import { IsEnum } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'registered_phone_numbers' })
export class RegisteredPhoneNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  number: string;

  @Column({ type: 'enum', enum: UserRole, nullable: true })
  @IsEnum(UserRole)
  role: UserRole;
}
