import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseUUIDPipe, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity.js';
import { WizardsService } from './wizards.service.js';
import { JwtAuthGuard } from '../../auth/auth/guards/jwt.auth.guard.js';
import { UpdateWizardProfileDto } from '../../dto/update.wizard.profile.dto.js';
import { CurrentUser } from '../../decorators/current.user.decorator.js';
import { RolesGuard } from '../../auth/auth/guards/roles.guard.js';
import { Roles } from '../../decorators/roles.decorator.js';
import { idsMatch } from '../../util/id.util.js';

interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}
 
@Controller("wizards")
export class WizardsController {
  constructor(private readonly wizardsService: WizardsService) {}
 
 
  @Get("without-active-quest")
  getWithoutActiveQuest() {
    return this.wizardsService.findWizardsWithNoActiveQuest();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Get("available-for-assignment")
  getAvailableForAssignment() {
    return this.wizardsService.findAvailableForAssignment();
  }
 

  @Get()
  findAll() {
    return this.wizardsService.findAll();
  }
 
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.wizardsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateProfile(
    @Param("id") id: string,
    @Body() dto: UpdateWizardProfileDto,
    @CurrentUser() user: RequestUser
  ) {
    if (user.role !== UserRole.TOWER && !idsMatch(user.userId, id)) {
      throw new ForbiddenException("You can only edit your own profile.");
    }
    return this.wizardsService.updateProfile(id, dto);
  }
 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.wizardsService.remove(id);
  }
}