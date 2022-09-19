import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateApplicationInput } from './create-application.dto';
export class EditApplicationInput {
  @IsNotEmpty()
  @IsString()
  applicationId: string;
}
