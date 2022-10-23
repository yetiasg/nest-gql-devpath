import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Product } from './product.entity';

@ObjectType()
export class ProductPagination {
  @Field(() => [Product])
  products: Product[];

  @Field(() => Int)
  total: number;
}
