import { REDIRECT_URI } from './social-util.constant';
import { ENV_VARIABLES } from '../../common/common.constants';
import {
  SocialProvider,
  SocialModuleOptions,
  GetKakaoAccessTokenParams,
} from './social-util.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SocialUtilService {}
