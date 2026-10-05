import { Transform } from "class-transformer";
import { IsUUID } from "class-validator";

export class JoinQuestDto {
  @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase() : value)
  wizardId: string;
}