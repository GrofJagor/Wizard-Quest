import { IsOptional, IsString } from "class-validator";
 
export class UpdateTowerProfileDto {
  @IsOptional()
  @IsString()
  name?: string;
 
  @IsOptional()
  @IsString()
  rank?: string;
}
 