import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationCursor } from '../common/pagination/pagination';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.entity';
import { CategoryPagination } from './category.pagination';
import { CategoryService } from './category.service';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => Category)
  getCategoryById(@Args('categoryId') categoryId: string): Promise<Category> {
    return this.categoryService.getById(categoryId);
  }

  @Query(() => [Category])
  getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAll();
  }

  @Query(() => CategoryPagination)
  getAllCategoriesWithPagination(
    @Args('pagination') pagination: PaginationCursor,
  ): Promise<CategoryPagination> {
    return this.categoryService.getAllPaginated(pagination);
  }

  @Mutation(() => Category)
  createCategory(
    @Args('categoryId') category: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(category);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('categoryId') categoryId: string,
    @Args('category') category: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(categoryId, category);
  }

  @Mutation(() => Category)
  deleteCategory(@Args('categoryId') categoryId: string): Promise<Category> {
    return this.categoryService.delete(categoryId);
  }
}
