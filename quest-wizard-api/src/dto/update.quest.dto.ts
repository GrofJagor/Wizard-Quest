import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";
import type { QuestLevel, QuestStatus } from "../entities/quest.entity.js";

const QUEST_LEVELS: QuestLevel[] = ["EASY", "MEDIUM", "HARD", "DEADLY"];
 
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
  @IsBoolean()
  open?: boolean;

}