import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SocialRegisterInput } from '@auth/dtos/social-register.dto';
import { IsOptional } from 'class-validator';

export class EditProfileInput extends PartialType(SocialRegisterInput) {
  @ApiProperty({
    name: '연고이팅 회원이신가요?',
    example: 'true',
    nullable: true,
  })
  @Transform((isYkClub) => JSON.parse(isYkClub.obj?.isYkClub))
  isYkClub?: boolean;

  @ApiProperty({
    name: '12dasd23',
    example: '소포 이벤트코드',
    nullable: true,
  })
  @IsOptional()
  sofoCode?: string;
}
