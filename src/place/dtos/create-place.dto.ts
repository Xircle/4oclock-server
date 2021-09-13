import { IsDate, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CoreOutput } from 'src/common/common.interface';
export class CreatePlaceInput {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString({
    each: true,
  })
  @IsNotEmpty()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  recommendation: string;

  @IsDate()
  @IsNotEmpty()
  startDateAt: Date;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({
    each: true,
  })
  @IsNotEmpty()
  categories: string[];
}
export class PlacePhotoInput {
  coverImage: Express.Multer.File;
  reviewImages: Express.Multer.File[];
}

export class CreatePlaceOutput extends CoreOutput {}
