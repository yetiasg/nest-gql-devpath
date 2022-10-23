import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from '../common/pagination/pagination';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserPagination } from './user.pagination';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  getUserById(@Args('userId') userId: string): Promise<User> {
    return this.userService.getOneById(userId);
  }

  @Query(() => [User])
  getAllUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Query(() => UserPagination, { nullable: true })
  getAllUsersWithPagination(
    @Args('pagination') pagination: Pagination,
  ): Promise<UserPagination> {
    return this.userService.getAllPaginated(pagination);
  }

  @Mutation(() => User)
  createUser(@Args('user') user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }

  @Mutation(() => User)
  updateUser(
    @Args('userId') userId: string,
    @Args('user') user: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(userId, user);
  }

  @Mutation(() => User)
  deleteUser(@Args('userId') userId: string): Promise<User> {
    return this.userService.delete(userId);
  }
}
