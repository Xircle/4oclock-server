import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SocialRegisterInput } from 'src/auth/dtos/social-register.dto';

export class EditProfileInput extends PartialType(SocialRegisterInput) {
  @ApiProperty({
    name: '연고이팅 회원이신가요?',
    example: 'true',
  })
  @IsString()
  @IsOptional()
  isYkClub?: boolean;

  @ApiProperty({
    name: '활동이력',
    example: '인사이더스 13기',
  })
  @IsString()
  @IsOptional()
  activities?: string;
}
