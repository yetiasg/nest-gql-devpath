import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

@InputType()
export class Pagination {
  @Field(() => Int)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset = 0;

  @Field(() => Int)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit = 10;
}

@InputType()
export class PaginationCursor {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  take = 10;

  @Field(() => Int)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page = 1;
}
