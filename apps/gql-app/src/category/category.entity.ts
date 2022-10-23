import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Field()
  @Column()
  readonly name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  readonly description?: string;

  @ManyToOne(() => Product, (product: Product) => product.categories, {
    nullable: true,
  })
  readonly products: Product[];
}
