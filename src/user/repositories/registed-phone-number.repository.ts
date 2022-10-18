import { RegisteredPhoneNumber } from './../entities/registed-phone-number.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(RegisteredPhoneNumber)
export class RegisteredPhoneNumberRepository extends Repository<RegisteredPhoneNumber> {}
