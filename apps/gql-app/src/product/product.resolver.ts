import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CurrentUser } from '../common/decorators/currentUserId.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Pagination } from '../common/pagination/pagination';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { User } from '../user/user.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductPagination } from './product.pagination';
import { ProductService } from './product.service';

const PRODUCT_CREATED_EVENT = 'productCreated';

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

    this.pubSub.publish(PRODUCT_CREATED_EVENT, {
      productCreated: newProduct,
    });
    return newProduct;
  }

  @Public()
  @Subscription(() => Product)
  productCreated() {
    return this.pubSub.asyncIterator(PRODUCT_CREATED_EVENT);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('productId') productId: string,
    @Args('product') product: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(productId, product);
  }

  @Mutation(() => Product)
  deleteProduct(@Args('productId') productId: string): Promise<Product> {
    return this.productService.delete(productId);
  }
}
