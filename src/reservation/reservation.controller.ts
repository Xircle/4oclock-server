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
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @UseGuards(AuthGuard())
  async makeReservation(
    @AuthUser() authUser: User,
    @Body() makeReservation: MakeReservationDto,
  ): Promise<MakeReservationOutput> {
    return this.reservationService.makeReservation(authUser, makeReservation);
  }

  @Delete()
  async deleteReservation() {}

  @Patch()
  async editReservation() {}
}
