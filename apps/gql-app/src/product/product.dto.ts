import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Product } from './product.entity';

@InputType()
export class CreateProductDto extends PartialType(Product) {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly description?: string;
}

@InputType()
export class UpdateProductDto extends PartialType(Product) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
