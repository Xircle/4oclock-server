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
  qAndA?: string[];
}
export class MainFeedPlace {
  id: string;
  name: string;
  coverImage: string;
  deadline?: string | undefined;
  startDateFromNow: string;
  oneLineIntroText?: string;
  recommendation?: string;
  views: number;
  participants: MainFeedPlaceParticipantsProfile[];
  participantsCount: number;
  leftParticipantsCount: number;
  isClosed: boolean;
  team?: string;
  myTeam?: boolean;
  seperatorMyTeam?: boolean;
  seperatorNotMyTeam?: boolean;
  qAnda?: string[];
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

export class GetPlacesQueryParameter {
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

  @ApiProperty({
    example: 'X',
    description: '팀 이름',
  })
  @IsString()
  @IsOptional()
  team?: string;
}

export class GetPlacesWhereOptions extends GetPlacesQueryParameter {}
export class WhereOptions extends GetPlacesQueryParameter {}
