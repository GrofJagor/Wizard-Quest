import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { QuestsService } from "./quests.service.js";
import { RolesGuard } from "../../auth/auth/guards/roles.guard.js";
import { JwtAuthGuard } from "../../auth/auth/guards/jwt.auth.guard.js";
import { User, UserRole } from "../../entities/user.entity.js";
import { Roles } from "../../decorators/roles.decorator.js";
import { CreateQuestDto } from "../../dto/crete.quest.dto.js";
import { UpdateQuestDto } from "../../dto/update.quest.dto.js";
import { CurrentUser } from "../../decorators/current.user.decorator.js";
import { JoinQuestDto } from "../../dto/join.quest.dto.js";
import { idsMatch } from "../../util/id.util.js";


interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}
 
@Controller("quests")
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}
 

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Post()
  create(@Body() dto: CreateQuestDto, @CurrentUser() user: RequestUser) {
    return this.questsService.create(dto, user.userId);
  }
 
  @Get()
  findAll() {
    return this.questsService.findAll();
  }
 
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.questsService.findOne(id);
  }
 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateQuestDto,
    @CurrentUser() user: RequestUser
  ) {
    return this.questsService.update(id, dto, user.userId);
  }
 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: RequestUser) {
    return this.questsService.remove(id, user.userId);
  }

 
  @Get("status/open")
  getOpenQuests() {
    return this.questsService.findOpenQuests();
  }
 
  @Get("status/in-progress")
  getInProgressQuests() {
    return this.questsService.findInProgressQuests();
  }
 
  @Get("status/completed")
  getCompletedQuests() {
    return this.questsService.findCompletedQuests();
  }
 
@UseGuards(JwtAuthGuard)
  @Post(":id/join")
  join(
    @Param("id", ParseIntPipe) questId: number,
    @Body("wizardId") wizardId: string,
    @CurrentUser() user: RequestUser
  ) {

    if (user.role !== UserRole.TOWER && !idsMatch(user.userId, wizardId)) {
      throw new ForbiddenException("You can only join a quest as yourself.");
    }
    
    return this.questsService.joinWizardToQuest(questId, wizardId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/leave")
  leave(@Param("id", ParseIntPipe) questId: number, @CurrentUser() user: RequestUser) {
    return this.questsService.leaveWizardFromQuest(questId, user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Post(":id/start")
  start(@Param("id", ParseIntPipe) questId: number, @CurrentUser() user: RequestUser) {
    return this.questsService.startQuest(questId, user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Post(":id/conclude")
  conclude(@Param("id", ParseIntPipe) questId: number, @CurrentUser() user: RequestUser) {
    return this.questsService.concludeQuest(questId, user.userId);
  }
 

  @Get("wizard/:wizardId/completed")
  getCompletedForWizard(@Param("wizardId") wizardId: string) {
    return this.questsService.getCompletedQuestsForWizard(wizardId);
  }
 

  @Get("tower/:towerId/created")
  getCreatedByTower(@Param("towerId") towerId: string) {
    return this.questsService.getQuestsCreatedByTower(towerId);
  }
}