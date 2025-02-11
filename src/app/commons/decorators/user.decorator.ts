import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
export const UserSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);
