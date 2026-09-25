import {
  Body,
  Controller,
  Delete,
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


@Controller("quests")
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}
 
  // ---- basic CRUD ----
 
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
 
  // ---- status-filtered lookups ----
 
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
 
  // ---- relation-based lookups ----
 
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