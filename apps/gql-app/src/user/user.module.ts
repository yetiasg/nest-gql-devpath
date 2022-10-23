import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserLoader } from './user.loader';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UniqueUsernameConstraint } from './validation/unique-username.validator';

@Module({
  controllers: [UserController],
  providers: [UserService, UserLoader, UserResolver, UniqueUsernameConstraint],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: 'PDF_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],
})
export class UserModule {}
