import { Inject } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
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

  @Subscription(() => Product)
  productUpdated() {
    return this.pubSub.asyncIterator(PRODUCT_EVENT.productUpdated);
  }

  @Subscription(() => Product)
  productDeleted() {
    return this.pubSub.asyncIterator(PRODUCT_EVENT.productDeleted);
  }
}
