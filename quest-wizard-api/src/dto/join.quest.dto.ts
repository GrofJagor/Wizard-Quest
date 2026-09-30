import { IsUUID } from "class-validator";

export class JoinQuestDto {
  @IsUUID()
  wizardId: string;
}