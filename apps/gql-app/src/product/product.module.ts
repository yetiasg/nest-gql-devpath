import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ProductSubscriptionResolver } from './product-subscription.resolver';
import { Product } from './product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  providers: [ProductService, ProductResolver, ProductSubscriptionResolver],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]), UserModule],
})
export class ProductModule {}
