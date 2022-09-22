import { Category } from './../entities/category.entity';
import { EntityRepository, Repository, FindManyOptions } from 'typeorm';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  public async findManyCategories(
    options: FindManyOptions<Category>,
  ): Promise<Category[]> {
    return this.find({
      ...options,
    });
  }
}
