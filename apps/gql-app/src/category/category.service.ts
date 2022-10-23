import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationCursor } from '../common/pagination/pagination';
import { Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.entity';
import { CategoryPagination } from './category.pagination';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRespository: Repository<Category>,
  ) {}

  getById(categoryId: string): Promise<Category> {
    return this.categoryRespository.findOne({
      where: {
        id: categoryId,
      },
    });
  }

  getAll(): Promise<Category[]> {
    return this.categoryRespository.find();
  }

  async getAllPaginated({
    take,
    page,
  }: PaginationCursor): Promise<CategoryPagination> {
    const categoriesCount = await this.categoryRespository.count();
    const categories = await this.categoryRespository.find({
      skip: take * page,
      take,
    });

    return {
      categories,
      total: categoriesCount,
    };
  }

  create(category: CreateCategoryDto): Promise<Category> {
    const newcategory = this.categoryRespository.create(category);
    return this.categoryRespository.save(newcategory);
  }

  async update(
    categoryId: string,
    category: UpdateCategoryDto,
  ): Promise<Category> {
    const { affected } = await this.categoryRespository.update(
      categoryId,
      category,
    );
    if (!affected) throw new NotFoundException('Category not found');
    return this.getById(categoryId);
  }

  async delete(categoryId: string): Promise<Category> {
    const categoryToDelete = await this.getById(categoryId);
    const { affected } = await this.categoryRespository.delete(categoryId);
    if (!affected) throw new NotFoundException('Category not found');
    return categoryToDelete;
  }
}
