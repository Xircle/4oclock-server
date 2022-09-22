import { CategoryService } from './category.service';
import { Controller } from '@nestjs/common';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
}
