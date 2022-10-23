import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductLoader } from './product.loader';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  providers: [ProductService, ProductLoader, ProductResolver],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product])],
})
export class ProductModule {}
