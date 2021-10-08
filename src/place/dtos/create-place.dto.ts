import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CoreOutput } from 'src/common/common.interface';

export class CreatePlaceInput {
  @ApiProperty({
    example: '춘자 카페',
    description: '장소 이름',
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '안암',
    description: '장소의 대학가 주변 위치',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: '안암에 이런 집은 없었다.',
    description: '장소 한줄소개',
  })
  @IsString()
  @IsNotEmpty()
  oneLineIntroText: string;

  @ApiProperty({
    example: '3000',
    description: '참가비',
  })
  @Transform((param) => JSON.parse(param.obj.participationFee))
  participationFee: number;

  @ApiProperty({
    example: '나이 20 ~ 25 중간',
    description: '연령대 권장사항',
  })
  @IsString()
  @IsNotEmpty()
  recommendation: string;

  @ApiProperty({
    example: '2021-09-53',
    description: '장소 미팅 시작 시간',
  })
  @IsDateString()
  @IsNotEmpty()
  startDateAt: Date;

  @ApiProperty({
    example: '고대에서 가장 시원한 맥주집!',
    description: '장소 설명 제목',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '준비물은 청춘과 체력! 같이 이런저런 얘기 나눠요~~',
    description: '장소 디테일 설명',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '[맥주, 호프]',
    description: '장소 해시태그',
  })
  @IsString({
    each: true,
  })
  @IsNotEmpty()
  categories: string[];

  @ApiProperty({
    example: '서울 강남구 강남대로 152길 42 2층',
    description: '장소 디테일 위치',
  })
  @IsString()
  @IsNotEmpty()
  detailAddress: string;

  @ApiProperty({
    example: 'https://map.naver.com',
    description: '맛집 정보 더보기',
  })
  @IsString()
  @IsNotEmpty()
  detailLink: string;

  @ApiProperty({
    example: '["정말 꿀잼인듯!!", "와 이런 장소가 있었다니 또 와야겠네요"]',
    description: '리뷰 설명 (사진과 순서대로)',
  })
  @IsString()
  @IsNotEmpty()
  reviewDescriptions: string[];
}
export class PlacePhotoInput {
  coverImage: Express.Multer.File[];
  reviewImages: Express.Multer.File[];
}

export class CreatePlaceOutput extends CoreOutput {}
