import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";
import type { QuestLevel, QuestStatus } from "../entities/quest.entity.js";

const QUEST_LEVELS: QuestLevel[] = ["EASY", "MEDIUM", "HARD", "DEADLY"];
const QUEST_STATUSES: QuestStatus[] = ["OPEN", "IN_PROGRESS", "COMPLETED"];
 
export class UpdateQuestDto {
  @IsOptional()
  @IsString()
  title?: string;
 
  @IsOptional()
  @IsEnum(QUEST_LEVELS)
  level?: QuestLevel;
 
  @IsOptional()
  @IsString()
  patron?: string;
 
  @IsOptional()
  @IsString()
  description?: string;
 
  @IsOptional()
  @IsInt()
  @Min(0)
  reward?: number;
 
  @IsOptional()
  @IsEnum(QUEST_STATUSES)
  status?: QuestStatus;
 
  @IsOptional()
  @IsBoolean()
  open?: boolean;
 
  @IsOptional()
  @IsUUID()
  createdByTowerId?: string;
}