import { UserRole } from '@user/entities/user.entity';
import { RegisteredPhoneNumber } from '../entities/registered-phone-number.entity';
import { EntityRepository, Repository } from 'typeorm';

export class VerifyByPhoneNumberOutput {
  ok: boolean;
  role?: UserRole;
}
@EntityRepository(RegisteredPhoneNumber)
export class RegisteredPhoneNumberRepository extends Repository<RegisteredPhoneNumber> {
  public async verifyByPhoneNumber(
    phoneNumber: string,
  ): Promise<VerifyByPhoneNumberOutput> {
    const row = await this.findOne({ number: phoneNumber });

    if (row) {
      const result = {
        ok: true,
        role: row.role,
      };
      await this.delete({ number: phoneNumber });
      return result;
    } else {
      return { ok: false };
    }
  }
}
