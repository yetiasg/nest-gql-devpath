import { Injectable, Scope } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as DataLoader from 'dataloader';

@Injectable({ scope: Scope.REQUEST })
export class UserLoader {
  constructor(private readonly userService: UserService) {}

  public readonly batchAuthors = new DataLoader(
    async (authorsIds: string[]) => {
      const users = await this.userService.getByIds(authorsIds);
      const usersMap = new Map(users.map((user) => [user.id, user]));
      return authorsIds.map((authorId) => usersMap.get(authorId));
    },
  );
}
