import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity.js';
import { WizardsService } from './wizards.service.js';
import { JwtAuthGuard } from '../../auth/auth/guards/jwt.auth.guard.js';
import { UpdateWizardProfileDto } from '../../dto/update.wizard.profile.dto.js';
import { CurrentUser } from '../../decorators/current.user.decorator.js';
import { RolesGuard } from '../../auth/auth/guards/roles.guard.js';
import { Roles } from '../../decorators/roles.decorator.js';

interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}
 
@Controller("wizards")
export class WizardsController {
  constructor(private readonly wizardsService: WizardsService) {}
 
  // ---- specific routes before the :id param route ----
 
  @Get("without-active-quest")
  getWithoutActiveQuest() {
    return this.wizardsService.findWizardsWithNoActiveQuest();
  }
 
  // ---- basic CRUD ----
 
  @Get()
  findAll() {
    return this.wizardsService.findAll();
  }
 
  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.wizardsService.findOne(id);
  }
 
  // A wizard may edit their OWN profile; a Tower (admin) may edit anyone's.
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateProfile(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateWizardProfileDto,
    @CurrentUser() user: RequestUser
  ) {
    if (user.role !== UserRole.TOWER && user.userId !== id) {
      throw new ForbiddenException("You can only edit your own profile.");
    }
    return this.wizardsService.updateProfile(id, dto);
  }
 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.wizardsService.remove(id);
  }
}