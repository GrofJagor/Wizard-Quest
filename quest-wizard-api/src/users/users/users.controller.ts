import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { UserRole } from "../../entities/user.entity.js";
import { CurrentUser } from "../../decorators/current.user.decorator.js";
import { JwtAuthGuard } from "../../auth/auth/guards/jwt.auth.guard.js";
import { RolesGuard } from "../../auth/auth/guards/roles.guard.js";
import { Roles } from "../../decorators/roles.decorator.js";


@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
 
  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@CurrentUser() user: { userId: string; email: string; role: UserRole }) {
    return this.usersService.findById(user.userId);
  }
 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Get()
  getAll() {
    return this.usersService.findAll();
  }
 

  @Get(":id")
  async getById(@Param("id") id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }
}