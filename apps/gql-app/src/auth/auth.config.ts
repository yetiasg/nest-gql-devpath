import { ConfigType, registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.AUTH0_CLIENT_SECRET ?? 'secret',
  clientId: process.env.AUTH0_CLIENT_ID,
  audience: process.env.AUTH0_AUDIENCE,
  domain: process.env.AUTH0_DOMAIN,
  issuer: process.env.AUTH0_ISSUER,
}));

export type AuthConfigType = ConfigType<typeof authConfig>;
