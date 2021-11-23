import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class IsEnteringData {
  @IsBoolean()
  @Transform((param) => param.obj?.flag)
  flag: boolean;

  @IsString()
  roomId: string;
}
