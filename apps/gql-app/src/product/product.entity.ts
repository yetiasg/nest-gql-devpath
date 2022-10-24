import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Product {
  @Field()
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Field()
  @Column()
  readonly name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  readonly description?: string;

  @Field(() => [Category], { nullable: true })
  @ManyToMany(() => Category, {
    nullable: true,
  })
  @JoinTable()
  readonly categories: Category[];

  @ManyToOne(() => User, (creator: User) => creator.products, {
    nullable: true,
  })
  readonly author: User;
}
