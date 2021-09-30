import { GetReservationParticipantNumberOutput } from './dtos/get-reservation-number.dto';
import { User } from './../user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  MakeReservationDto,
  MakeReservationOutput,
} from './dtos/make-reservation.dto';
import { ReservationService } from './reservation.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Reservation')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard())
@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post('')
  @ApiOperation({ summary: '장소 예약하기' })
  async makeReservation(
    @GetUser() authUser: User,
    @Body() makeReservation: MakeReservationDto,
  ): Promise<MakeReservationOutput> {
    return this.reservationService.makeReservation(authUser, makeReservation);
  }

  @Get(':placeId/number')
  @ApiOperation({ summary: '장소 시간대별 참가자 수 보기' })
  async getReservationParticipantNumber(
    @Param('placeId') placeId: string,
  ): Promise<GetReservationParticipantNumberOutput> {
    return this.reservationService.getReservationParticipantNumber(placeId);
  }

  @Delete(':placeId')
  @ApiOperation({ summary: '장소 예약 취소하기' })
  async deleteReservation(@Param('placeId') placeId: string) {
    return this.reservationService.deleteReservation(placeId);
  }

  @Patch()
  async editReservation() {}
}
