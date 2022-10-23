import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';

@Module({
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
  imports: [TypeOrmModule.forFeature([Category])],
})
export class CategoryModule {}
