import { CategoryRepository } from './repositories/category.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private async seeCategoriesBrief() {}
}
