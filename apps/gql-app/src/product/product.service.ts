import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from '../common/pagination/pagination';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductPagination } from './product.pagination';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  getById(productId: string): Promise<Product> {
    return this.productRepository.findOne({
      where: {
        id: productId,
      },
      relations: {
        categories: true,
        author: true,
      },
    });
  }

  getAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: {
        categories: true,
        author: true,
      },
    });
  }

  async getAllPaginated({
    limit,
    offset,
  }: Pagination): Promise<ProductPagination> {
    const userCount = await this.productRepository.count();
    const products = await this.productRepository.find({
      relations: {
        categories: true,
        author: true,
      },
      take: limit,
      skip: offset,
    });

    return {
      products,
      total: userCount,
    };
  }

  async create(product: CreateProductDto, author: User): Promise<Product> {
    const newUser = this.productRepository.create({ ...product, author });
    return this.productRepository.save(newUser);
  }

  async update(productId: string, product: UpdateProductDto): Promise<Product> {
    const { affected } = await this.productRepository.update(
      productId,
      product,
    );
    if (!affected) throw new NotFoundException('Product not found');
    return this.getById(productId);
  }

  async delete(productId: string): Promise<Product> {
    const productToDelete = await this.getById(productId);
    const { affected } = await this.productRepository.delete(productId);
    if (!affected) throw new NotFoundException('Product not found');
    return productToDelete;
  }
}
