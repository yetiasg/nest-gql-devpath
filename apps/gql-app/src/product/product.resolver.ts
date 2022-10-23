import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../common/decorators/currentUserId.decorator';
import { Pagination } from '../common/pagination/pagination';
import { User } from '../user/user.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductPagination } from './product.pagination';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

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
  createProduct(
    @Args('product') product: CreateProductDto,
    @CurrentUser() currentUser: User,
  ): Promise<Product> {
    return this.productService.create(product, currentUser);
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
