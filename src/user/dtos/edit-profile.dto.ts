import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SocialRegisterInput } from '@auth/dtos/social-register.dto';

export class EditProfileInput extends PartialType(SocialRegisterInput) {
  @ApiProperty({
    name: '연고이팅 회원이신가요?',
    example: 'true',
    nullable: true,
  })
  @Transform((isYkClub) => JSON.parse(isYkClub.obj?.isYkClub))
  isYkClub?: boolean;
}
