import { Body, Controller, ForbiddenException, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity.js';
import { TowersService } from './towers.service.js';
import { JwtAuthGuard } from '../../auth/auth/guards/jwt.auth.guard.js';
import { CurrentUser } from '../../decorators/current.user.decorator.js';
import { UpdateTowerProfileDto } from  '../../dto/update.tower.profile.dto.js';
import { idsMatch } from '../../util/id.util.js';

interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}
 
@Controller("towers")
export class TowersController {
  constructor(private readonly towersService: TowersService) {}
 
  @Get()
  findAll() {
    return this.towersService.findAll();
  }
 
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.towersService.findOne(id);
  }
 
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateProfile(
    @Param("id") id: string,
    @Body() dto: UpdateTowerProfileDto,
    @CurrentUser() user: RequestUser
  ) {
    if (!idsMatch(user.userId, id)) {
      throw new ForbiddenException("You can only edit your own profile.");
    }
    return this.towersService.updateProfile(id, dto);
  }
}