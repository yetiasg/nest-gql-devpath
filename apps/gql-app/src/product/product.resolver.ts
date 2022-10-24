import { Inject } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CurrentUser } from '../common/decorators/currentUserId.decorator';
import { Pagination } from '../common/pagination/pagination';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { User } from '../user/user.entity';
import { UserLoader } from '../user/user.loader';
import { PRODUCT_EVENT } from './product-subscription.resolver';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductPagination } from './product.pagination';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
    private readonly productService: ProductService,
    private readonly userLoader: UserLoader,
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

  @ResolveField('author', () => User)
  async getAuthor(@Parent() product: Product) {
    const authorId = product.author.id;
    return this.userLoader.batchAuthors.load(authorId);
  }
}
