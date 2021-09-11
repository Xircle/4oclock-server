import { SocialUtilService } from './social-util.service';
import { ENV_VARIABLES } from '../../common/common.constants';
import { SocialModuleOptions } from './social-util.interface';
import { DynamicModule, Global, Module } from '@nestjs/common';

@Module({})
@Global()
export class SocialUtilModule {
  static forRoot(options: SocialModuleOptions): DynamicModule {
    return {
      module: SocialUtilModule,
      providers: [
        {
          provide: ENV_VARIABLES,
          useValue: options,
        },
        SocialUtilService,
      ],
      exports: [SocialUtilService],
    };
  }
}
