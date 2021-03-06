import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetReservationParticipantNumberOutput } from './dtos/get-reservation-number.dto';
import {
  MakeReservationDto,
  MakeReservationOutput,
} from './dtos/make-reservation.dto';
import { ReservationService } from './reservation.service';
import { PatchReservationInput } from './dtos/patch-reservation.dto';
import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@user/entities/user.entity';

@ApiTags('Reservation')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(JwtAuthGuard)
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

  @Patch(':placeId')
  @ApiOperation({ summary: '장소 예약 취소하기' })
  async patchReservation(
    @GetUser() authUser: User,
    @Param('placeId') placeId: string,
    @Body() patchReservationInput: PatchReservationInput,
  ) {
    return this.reservationService.patchReservation(
      authUser,
      placeId,
      patchReservationInput,
    );
  }

  @Patch()
  async editReservation() {}

  @Patch('cancel-by-creator/:placeId/:participantId')
  @ApiOperation({ summary: '생성자에 의해 예약 취소하기' })
  async cancelReservationByCreator(
    @GetUser() authUser: User,
    @Param('placeId') placeId: string,
    @Param('participantId') participantId: string,
  ) {
    return this.reservationService.cancelReservationByCreator(
      authUser,
      placeId,
      participantId,
    );
  }
}
