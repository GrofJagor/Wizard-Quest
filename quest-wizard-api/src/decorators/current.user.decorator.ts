import { createParamDecorator, ExecutionContext } from "@nestjs/common";
 
/** Usage: @CurrentUser() user: { userId: string; email: string; role: UserRole } */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
 