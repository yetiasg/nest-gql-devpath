import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCategoryDto {
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
export class UpdateCategoryDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  readonly description?: string;
}
