import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class UserPagination {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  total = 0;
}
