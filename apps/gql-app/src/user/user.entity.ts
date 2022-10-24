import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Role } from '../role/role.type';

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  readonly id: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  readonly externalId?: string;

  @Field()
  @Column({ default: false })
  readonly isActive: boolean;

  @Field()
  @Column({ unique: true })
  readonly email: string;

  @Field({ nullable: true })
  @Column({ unique: true, nullable: true })
  readonly username?: string;

  @Field()
  @Column()
  readonly firstName: string;

  @Field()
  @Column()
  readonly lastName: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  readonly role: Role;

  @Field(() => [Product], { nullable: true })
  @OneToMany(() => Product, (product: Product) => product.author, {
    nullable: true,
  })
  readonly products: Product[];
}
