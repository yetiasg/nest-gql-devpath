import { Inject } from '@nestjs/common';
import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from '../pub-sub/pub-sub.module';
import { Product } from './product.entity';

export enum PRODUCT_EVENT {
  productCreated = 'productCreated',
  productUpdated = 'productUpdated',
  productDeleted = 'productDeleted',
}

@Resolver(() => Product)
export class ProductSubscriptionResolver {
  constructor(@Inject(PUB_SUB) private readonly pubSub: RedisPubSub) {}

  @Subscription(() => Product)
  productCreated() {
    return this.pubSub.asyncIterator(PRODUCT_EVENT.productCreated);
  }

  @Subscription(() => Product, {
    filter: (payload, variables) =>
      String(payload.productUpdated.id) === String(variables.productId),
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productUpdated(@Args('productId') productId: string) {
    return this.pubSub.asyncIterator(PRODUCT_EVENT.productUpdated);
  }

  @Subscription(() => Product, {
    filter: (payload, variables) =>
      String(payload.productUpdated.id) === String(variables.productId),
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productDeleted(@Args('productId') productId: string) {
    return this.pubSub.asyncIterator(PRODUCT_EVENT.productDeleted);
  }
}
