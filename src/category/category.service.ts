import { SeeAllCategoryOutput } from './dtos/see-all-category.dto';
import { CategoryRepository } from './repositories/category.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  private async seeCategoriesBrief(): Promise<SeeAllCategoryOutput> {
    try {
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
