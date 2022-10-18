import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'registered_phone_numbers' })
export class RegisteredPhoneNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  number: string;
}
