import { SocialRegisterInput } from 'src/auth/dtos/social-register.dto';

export interface EditProfileInput extends Partial<SocialRegisterInput> {}
