import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}
registerEnumType(Role, { name: 'Role' });
