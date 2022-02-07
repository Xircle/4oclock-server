import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SocialRegisterInput } from '@auth/dtos/social-register.dto';
import { IsOptional, IsString } from 'class-validator';

export class EditProfileInput extends PartialType(SocialRegisterInput) {
  @ApiProperty({
    name: 'isYkClub',
    example: 'true',
    nullable: true,
  })
  @Transform((isYkClub) => JSON.parse(isYkClub.obj?.isYkClub))
  isYkClub?: boolean;

  @ApiProperty({
    name: 'sofoCode',
    example: '소포 이벤트코드',
    nullable: true,
  })
  @IsOptional()
  sofoCode?: string;
}

export class EditPlaceQueryParam {
  @ApiProperty({
    example: 'weonfowfe',
    description: 'code',
  })
  @IsString()
  @IsOptional()
  code?: string;
}
