import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'UniqueUsername', async: true })
@Injectable()
export class UniqueUsernameConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  async validate(username: string) {
    const user = await this.userService.getOneByUsername(username);
    if (user) return false;
    return true;
  }

  defaultMessage(): string {
    return `User with this username aleready exist`;
  }
}

export function UniqueUsername() {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: UniqueUsernameConstraint,
    });
  };
}
