import { PartialType } from '@nestjs/swagger';
import { SocialRegisterInput } from 'src/auth/dtos/social-register.dto';

export class EditProfileInput extends PartialType(SocialRegisterInput) {}
