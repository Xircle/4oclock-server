import { GetAreaOutput } from './dtos/get-areas.dto';
import { AreaService } from './area.service';
import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Area')
@ApiOkResponse()
@ApiUnauthorizedResponse()
@Controller('area')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Get('/all')
  async getAreas(): Promise<GetAreaOutput> {
    return await this.areaService.getAreas();
  }
}
