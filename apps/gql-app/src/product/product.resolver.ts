import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CurrentUser } from '../common/decorators/currentUserId.decorator';
import { Pagination } from '../common/pagination/pagination';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { User } from '../user/user.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductPagination } from './product.pagination';
import { ProductService } from './product.service';

enum PRODUCT_EVENT {
  productCreated = 'productCreated',
  productUpdated = 'productUpdated',
  productDeleted = 'productDeleted',
}

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Query(() => Product)
  getProductById(@Args('productId') productId: string): Promise<Product> {
    return this.productService.getById(productId);
  }

  @Query(() => [Product])
  getAllProducts(): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Query(() => ProductPagination)
  getAllProductsWithPagination(
    @Args('pagination') pagination: Pagination,
  ): Promise<ProductPagination> {
    return this.productService.getAllPaginated(pagination);
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('product') product: CreateProductDto,
    @CurrentUser() currentUser: User,
  ): Promise<Product> {
    const newProduct = await this.productService.create(product, currentUser);
    this.pubSub.publish(PRODUCT_EVENT.productCreated, {
      productCreated: newProduct,
    });
    return newProduct;
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('product') product: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productService.update(productId, product);
    this.pubSub.publish(PRODUCT_EVENT.productUpdated, {
      productUpdated: updatedProduct,
    });
    return updatedProduct;
  }

  @Mutation(() => Product)
  async deleteProduct(@Args('productId') productId: string): Promise<Product> {
    const deletedProduct = await this.productService.delete(productId);
    this.pubSub.publish(PRODUCT_EVENT.productDeleted, {
      productDeleted: deletedProduct,
    });
    return deletedProduct;
  }

  @Subscription(() => Product)
  productCreated() {
    return this.pubSub.asyncIterator(PRODUCT_EVENT.productCreated);
  }

  @Subscription(() => Product)
  productUpdated() {
    return this.pubSub.asyncIterator(PRODUCT_EVENT.productUpdated);
  }

  @Subscription(() => Product)
  productDeleted() {
    return this.pubSub.asyncIterator(PRODUCT_EVENT.productDeleted);
  }
}
