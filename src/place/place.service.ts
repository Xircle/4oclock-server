import { S3Service } from 'src/aws/s3/s3.service';
import {
  CreatePlaceInput,
  CreatePlaceOutput,
  PlacePhotoInput,
} from './dtos/create-place.dto';
import { GetPlacesByLocationOutput } from './dtos/get-place-by-Location.dto';
import { Place } from './entities/place.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPlaceByIdOutput } from './dtos/get-place-by-id.dto';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private placeRepository: Repository<Place>,
    private s3Service: S3Service,
  ) {}

  async getPlacesByLocation(
    location: string,
    page: number,
  ): Promise<GetPlacesByLocationOutput> {
    try {
      const places = await this.placeRepository.find({
        where: {
          location: location,
          isClosed: false,
        },
        order: {
          startDateAt: 'ASC',
        },
        take: 10,
        skip: 10 * (page - 1),
      });
      console.log(places);
      return {
        ok: true,
        places,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getPlaceById(placeId: string): Promise<GetPlaceByIdOutput> {
    try {
      const place = await this.placeRepository.findOne({
        where: {
          id: placeId,
        },
        relations: ['participants', 'placeDetail'],
      });

      console.log(place);
      if (!place) {
        return {
          ok: false,
          error: '존재하지 않는 모임입니다.',
        };
      }
      console.log(place.placeDetail);

      return {
        ok: true,
        place,
      };
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async createPlace(
    createPlaceInput: CreatePlaceInput,
    placePhotoInput: PlacePhotoInput,
  ): Promise<CreatePlaceOutput> {
    const {
      name,
      location,
      tags,
      recommendation,
      startDateAt,
      title,
      description,
      categories,
    } = createPlaceInput;
    const { coverImage, reviewImages } = placePhotoInput;

    // Upload to S3
    // const coverImageS3Url = await this.s3Service.uploadToS3(coverImage)

    return { ok: true };
  }
}
