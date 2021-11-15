import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): { id: string | number; email: string; role: string } => {
  return ctx.switchToHttp().getRequest().user;
});
export default AuthUser;
