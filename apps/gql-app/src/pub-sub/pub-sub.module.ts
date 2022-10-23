import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        new RedisPubSub({
          connection: {
            host: configService.get<string>('REDIS_HOST'),
            port: Number(configService.get<string>('REDIS_PORT')),
            password: configService.get<string>('REDIS_PASSWORD'),
          },
        }),
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
