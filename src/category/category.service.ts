import { SeeAllCategoryOutput } from './dtos/see-all-category.dto';
import { CategoryRepository } from './repositories/category.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async seeCategoriesBrief(): Promise<SeeAllCategoryOutput> {
    try {
      const categories = await this.categoryRepository.find();
      return { ok: true, data: categories };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
