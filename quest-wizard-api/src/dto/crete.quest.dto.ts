import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";
import type{ QuestLevel } from "../entities/quest.entity.js";

 
const QUEST_LEVELS: QuestLevel[] = ["EASY", "MEDIUM", "HARD", "DEADLY"];
 
export class CreateQuestDto {
  @IsString()
  title: string;
 
  @IsEnum(QUEST_LEVELS)
  level: QuestLevel;
 
  @IsString()
  patron: string;
 
  @IsString()
  description: string;
 
  @IsInt()
  @Min(0)
  reward: number;
 
  @IsOptional()
  @IsBoolean()
  open?: boolean;

  @IsOptional()
  @IsArray()
  assignedWizardIds?: string[];
}
 
