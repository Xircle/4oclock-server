import { GetReservationParticipantNumberOutput } from './dtos/get-reservation-number.dto';
import { JwtService } from '@nestjs/jwt';
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

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @UseGuards(AuthGuard())
  async makeReservation(
    @GetUser() authUser: User,
    @Body() makeReservation: MakeReservationDto,
  ): Promise<MakeReservationOutput> {
    return this.reservationService.makeReservation(authUser, makeReservation);
  }

  @Get(':placeId/number')
  @UseGuards(AuthGuard())
  async getReservationParticipantNumber(
    @Param('placeId') placeId: string,
  ): Promise<GetReservationParticipantNumberOutput> {
    return this.reservationService.getReservationParticipantNumber(placeId);
  }

  @Delete()
  async deleteReservation() {}

  @Patch()
  async editReservation() {}
}
