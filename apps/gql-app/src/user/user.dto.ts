import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../role/role.type';
import { User } from './user.entity';
import { UniqueUsername } from './validation/unique-username.validator';

@InputType()
export class CreateUserDto extends PartialType(User) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @UniqueUsername()
  readonly username?: string;

  @Field(() => Role)
  @IsEnum(Role)
  @IsNotEmpty()
  readonly role: Role = Role.CUSTOMER;
}

@InputType()
export class UpdateUserDto extends PartialType(User) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @UniqueUsername()
  readonly username?: string;

  @Field(() => Role, { nullable: true })
  @IsEnum(Role)
  @IsOptional()
  readonly role?: Role;
}
