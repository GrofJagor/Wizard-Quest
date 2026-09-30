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
import { UserRole } from "../../entities/user.entity.js";
import { Roles } from "../../decorators/roles.decorator.js";
import { CreateQuestDto } from "../../dto/crete.quest.dto.js";
import { UpdateQuestDto } from "../../dto/update.quest.dto.js";
import { CurrentUser } from "../../decorators/current.user.decorator.js";
import { JoinQuestDto } from "../../dto/join.quest.dto.js";


 
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
  create(@Body() dto: CreateQuestDto) {
    return this.questsService.create(dto);
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
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateQuestDto) {
    return this.questsService.update(id, dto);
  }
 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TOWER)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.questsService.remove(id);
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
    @Body() dto: JoinQuestDto,
    @CurrentUser() user: RequestUser
  ) {
    if (user.role !== UserRole.TOWER && user.userId !== dto.wizardId) {
      throw new ForbiddenException("You can only join a quest as yourself.");
    }
    return this.questsService.joinWizardToQuest(questId, dto.wizardId);
  }

 
  @UseGuards(JwtAuthGuard)
  @Get("wizard/:wizardId/completed")
  getCompletedForWizard(@Param("wizardId", ParseUUIDPipe) wizardId: string) {
    return this.questsService.getCompletedQuestsForWizard(wizardId);
  }
 
  @UseGuards(JwtAuthGuard)
  @Get("tower/:towerId/created")
  getCreatedByTower(@Param("towerId", ParseUUIDPipe) towerId: string) {
    return this.questsService.getQuestsCreatedByTower(towerId);
  }
}
 