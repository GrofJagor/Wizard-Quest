import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../entities/user.entity.js";

 
 
export const ROLES_KEY = "roles";
 
/** Usage: @Roles(UserRole.TOWER) on a controller method, combined with RolesGuard. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
 