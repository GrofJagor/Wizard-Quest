import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { UserRole } from "../../entities/user.entity.js";
import { CurrentUser } from "../../decorators/current.user.decorator.js";
import { JwtAuthGuard } from "../../auth/auth/guards/jwt.auth.guard.js";
import { RolesGuard } from "../../auth/auth/guards/roles.guard.js";
import { Roles } from "../../decorators/roles.decorator.js";


@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
 
  /** Any authenticated user (Wizard or Tower) can hit this. */
  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@CurrentUser() user: { userId: string; email: string; role: UserRole }) {
    return this.usersService.findById(user.userId);
  }
 
  /** Tower (admin) only — RolesGuard runs AFTER JwtAuthGuard populates request.user. */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Get()
  getAll() {
    return this.usersService.findAll();
  }
}
 