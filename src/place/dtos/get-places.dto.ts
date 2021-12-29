import { CoreOutput } from '@common/common.interface';
import { ApiProperty } from '@nestjs/swagger';
import { PlaceType } from '@place/entities/place.entity';
import { PlaceMetaData } from '@place/interface/places-with-meta';
import { Gender } from '@user/entities/user-profile.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class MainFeedPlaceParticipantsProfile {
  userId: string;
  profileImgUrl: string;
  gender: Gender;
  age: number;
  job: string;
  shortBio: string;
  isYkClub: boolean;
}
export class MainFeedPlace {
  id: string;
  name: string;
  coverImage: string;
  deadline?: string | undefined;
  startDateFromNow: string;
  oneLineIntroText?: string;
  views: number;
  participants: MainFeedPlaceParticipantsProfile[];
  participantsCount: number;
  leftParticipantsCount: number;
  isClosed: boolean;
}

export class GetPlacesInput {
  location?: string;
  page: number;
}
export class GetPlacesOutput extends CoreOutput {
  places?: MainFeedPlace[];
  meta: PlaceMetaData;
  eventBannerImageUrl?: string;
}

export class GetPlacesParameter {
  @ApiProperty({
    example: '전체, 신촌, 안암',
    description: '장소의 위치',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    example: 'All',
    enum: PlaceType,
    enumName: 'PlaceType',
    description: '장소의 종류',
    default: PlaceType.All,
  })
  @IsEnum(PlaceType)
  @IsOptional()
  placeType?: PlaceType;
}

export class GetPlacesWhereOptions extends GetPlacesParameter {}
export class WhereOptions extends GetPlacesParameter {}
