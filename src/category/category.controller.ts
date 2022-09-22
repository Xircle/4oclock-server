import { CategoryService } from './category.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CoreOutput } from '@common/common.interface';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/all/brief')
  @ApiOperation({ summary: '카테고리 간략히 보기' })
  async seeAllBrief(): Promise<CoreOutput> {
    return { ok: true };
  }

  @Get('/all/detail')
  @ApiOperation({ summary: '카테고리 자세히 보기' })
  async seeAllDetail(): Promise<CoreOutput> {
    return { ok: true };
  }
}
