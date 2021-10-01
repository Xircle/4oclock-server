import { AuthGuard } from '@nestjs/passport';
import { Controller, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Review')
@ApiBearerAuth('jwt')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@UseGuards(AuthGuard())
@Controller('review')
export class ReviewController {
    constructor() {}
}
