import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from '../common/pagination/pagination';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserLoader } from './user.loader';
import { UserPagination } from './user.pagination';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userLoader: UserLoader,
  ) {}

  async getOneById(userId: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        products: true,
      },
    });
  }

  getOneByExternalId(externalId: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        externalId,
      },
    });
  }

  getOneByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  getAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: {
        products: true,
      },
    });
  }

  async getAllPaginated({
    limit,
    offset,
  }: Pagination): Promise<UserPagination> {
    const usersCount = await this.userRepository.count();
    const users = await this.userRepository.find({
      relations: {
        products: true,
      },
      take: limit,
      skip: offset,
    });

    return { users, total: usersCount };
  }

  create(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async update(userId: string, user: UpdateUserDto): Promise<User> {
    const { affected } = await this.userRepository.update(userId, user);
    if (!affected) throw new NotFoundException('User not found');
    return this.getOneById(userId);
  }

  async delete(userId: string): Promise<User> {
    const userToDelete = await this.getOneById(userId);
    const { affected } = await this.userRepository.delete(userId);
    if (!affected) throw new NotFoundException('User not found');
    return userToDelete;
  }
}
