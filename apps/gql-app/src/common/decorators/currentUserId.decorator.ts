import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    if (ctx.getType() === 'http') {
      return ctx.switchToHttp().getRequest().user;
    }
    if (ctx.getType<GqlContextType>() === 'graphql') {
      const { req } = GqlExecutionContext.create(ctx).getContext();
      return req.user;
    }
    return null;
  },
);
