import { CoreOutput } from '@common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePlaceInput {
  @ApiProperty({
    example: '1as223asd',
    description: '카카오 placeId',
  })
  @IsString()
  @IsNotEmpty()
  placeId: string;

  @ApiProperty({
    example: '춘자 카페',
    description: '장소 이름',
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '고대에서 가장 시원한 맥주집!',
    description: '장소 설명 제목',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: '준비물은 청춘과 체력! 같이 이런저런 얘기 나눠요~~',
    description: '장소 디테일 설명',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '4',
    description: '모임 인원수',
  })
  @Transform((param) => JSON.parse(param?.obj?.maxParticipantsNumber))
  maxParticipantsNumber: number;

  @ApiProperty({
    example: '안암',
    nullable: true,
    description: '장소의 대학가 주변 위치',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    example: '안암에 이런 집은 없었다.',
    nullable: true,
    description: '장소 한줄소개',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  oneLineIntroText?: string;

  @ApiProperty({
    example: '3000',
    description: '참가비',
  })
  @Transform((param) => JSON.parse(param?.obj.participationFee))
  @IsNotEmpty()
  participationFee: number;

  @ApiProperty({
    example: '나이 20 ~ 25 중간',
    description: '연령대 권장사항',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  recommendation?: string;

  @ApiProperty({
    example: '2021-11-29T05:35:14.757Z',
    description: '미팅 시작 날짜',
  })
  @IsDate()
  @IsNotEmpty()
  startDateAt: Date;

  @ApiProperty({
    example: '"[맥주, 호프]"',
    nullable: true,
    description: '장소 해시태그',
  })
  @Transform((param) => JSON.parse(param?.obj.categories))
  @IsOptional()
  categories?: string[];

  @ApiProperty({
    example: '서울 강남구 강남대로 152길 42 2층',
    description: '장소 디테일 위치',
  })
  @IsString()
  @IsNotEmpty()
  detailAddress: string;

  @ApiProperty({
    example: 'https://map.naver.com',
    nullable: true,
    description: '맛집 정보 더보기',
  })
  @IsString()
  @IsOptional()
  detailLink?: string;
}
export class PlacePhotoInput {
  coverImage: Express.Multer.File[];
  subImages: Express.Multer.File[];
}

export class CreatePlaceOutput extends CoreOutput {}
