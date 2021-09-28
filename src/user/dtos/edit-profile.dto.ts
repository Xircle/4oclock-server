import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SocialRegisterInput } from 'src/auth/dtos/social-register.dto';

export class EditProfileInput extends PartialType(SocialRegisterInput) {
  @ApiProperty({
    name: '활동이력',
    example: '인사이더스 13기',
  })
  @IsString()
  @IsOptional()
  activities?: string;
}
